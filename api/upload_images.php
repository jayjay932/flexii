<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Crée le dossier si nécessaire
$uploadDir = __DIR__ . '/../uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$responseUrls = [];

if (!empty($_FILES['images'])) {
    foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
        if ($_FILES['images']['error'][$key] === UPLOAD_ERR_OK) {
            $originalName = basename($_FILES['images']['name'][$key]);
            $extension = pathinfo($originalName, PATHINFO_EXTENSION);
            $newName = uniqid('img_') . '.' . $extension;

            $destination = $uploadDir . $newName;
            if (move_uploaded_file($tmpName, $destination)) {
                $url = "http://localhost/flexii/uploads/$newName";

                $responseUrls[] = $url;
            }
        }
    }
}

echo json_encode(['urls' => $responseUrls]);
exit;
