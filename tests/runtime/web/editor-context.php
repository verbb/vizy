<?php
// Only this checkout's guarded disposable app can expose these browser controls.
// They age already signed contexts or expire the current fixture login; they do
// not replace production verification, field rendering, autosave or persistence.
require dirname(__DIR__) . '/bootstrap.php';
$app = require CRAFT_VENDOR_PATH . '/craftcms/cms/bootstrap/web.php';

final class EditorContextBrowserController extends \craft\web\Controller
{
    public function actionRun(): \yii\web\Response
    {
        $this->requireCpRequest();
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        $this->requireLogin();
        $fixture = json_decode(file_get_contents(CRAFT_BASE_PATH . '/../browser.json'), true, 512, JSON_THROW_ON_ERROR);
        $user = Craft::$app->getUser();
        if ((int)$user->getId() !== (int)$fixture['actorId']) {
            throw new \yii\web\ForbiddenHttpException('Fixture editor required.');
        }
        $operation = $this->request->getRequiredBodyParam('operation');
        if ($operation === 'age') {
            $tokens = $this->request->getRequiredBodyParam('tokens');
            if (!is_array($tokens) || count($tokens) > 25) throw new \yii\web\BadRequestHttpException();
            $aged = [];
            foreach ($tokens as $token) {
                $context = \verbb\vizy\Vizy::$plugin->getEditorContexts()->verify((string)$token);
                if ((int)$context['ownerId'] !== (int)$fixture['entryId']) throw new \yii\web\ForbiddenHttpException();
                $context['issuedAt'] = time() - 86400;
                $aged[$token] = rtrim(strtr(base64_encode(Craft::$app->getSecurity()->hashData(\craft\helpers\Json::encode($context))), '+/', '-_'), '=');
            }
            return $this->asJson(['tokens' => $aged]);
        }
        if ($operation === 'expire') {
            Craft::$app->getSession()->set($user->authTimeoutParam, time() - 10);
        } elseif ($operation === 'regenerate') {
            Craft::$app->getSession()->regenerateID(true);
        } elseif ($operation !== 'session') {
            throw new \yii\web\BadRequestHttpException();
        }
        return $this->asJson([
            'login' => hash_hmac('sha256', (string)$user->getToken(), 'disposable-browser-proof'),
            'php' => PHP_VERSION,
            'craft' => Craft::$app->getVersion(),
        ]);
    }
}

$app->controllerMap['editor-context-browser'] = EditorContextBrowserController::class;
$app->runAction('editor-context-browser/run');
$app->getResponse()->send();
