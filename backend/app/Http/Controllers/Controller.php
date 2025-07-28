<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Log;

/**
 * Base Controller class for the application
 * 
 * This class provides common functionality for all controllers
 * including authorization, validation, and response handling.
 */
abstract class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // Common initialization for all controllers
    }

    /**
     * Send a success response
     *
     * @param mixed $data
     * @param string $message
     * @param int $statusCode
     * @return \Illuminate\Http\JsonResponse
     */
    protected function successResponse($data = null, $message = 'Success', $statusCode = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $statusCode);
    }

    /**
     * Send an error response
     *
     * @param string $message
     * @param int $statusCode
     * @param mixed $errors
     * @return \Illuminate\Http\JsonResponse
     */
    protected function errorResponse($message = 'Error occurred', $statusCode = 400, $errors = null)
    {
        $response = [
            'success' => false,
            'message' => $message
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Send a not found response
     *
     * @param string $message
     * @return \Illuminate\Http\JsonResponse
     */
    protected function notFoundResponse($message = 'Resource not found')
    {
        return $this->errorResponse($message, 404);
    }

    /**
     * Send an unauthorized response
     *
     * @param string $message
     * @return \Illuminate\Http\JsonResponse
     */
    protected function unauthorizedResponse($message = 'Unauthorized access')
    {
        return $this->errorResponse($message, 401);
    }

    /**
     * Send a forbidden response
     *
     * @param string $message
     * @return \Illuminate\Http\JsonResponse
     */
    protected function forbiddenResponse($message = 'Access forbidden')
    {
        return $this->errorResponse($message, 403);
    }

    /**
     * Validate request data with custom rules
     *
     * @param \Illuminate\Http\Request $request
     * @param array $rules
     * @param array $messages
     * @param array $attributes
     * @return array
     */
    protected function validateRequest($request, $rules, $messages = [], $attributes = [])
    {
        return $request->validate($rules, $messages, $attributes);
    }

    /**
     * Log an error with context
     *
     * @param \Exception $exception
     * @param string $context
     * @return void
     */
    protected function logError($exception, $context = '')
    {
        Log::error($context . ': ' . $exception->getMessage(), [
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
            'trace' => $exception->getTraceAsString()
        ]);
    }
}
