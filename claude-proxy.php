<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }

$ANTHROPIC_KEY = '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';

$body = file_get_contents('php://input');
$decoded = json_decode($body, true);
if (!$decoded) { http_response_code(400); echo json_encode(['error' => 'Invalid JSON']); exit; }

$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => $body,
  CURLOPT_HTTPHEADER => [
    'Content-Type: application/json',
    'x-api-key: ' . $ANTHROPIC_KEY,
    'anthropic-version: 2023-06-01',
  ],
]);

$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($status);
echo $response;
