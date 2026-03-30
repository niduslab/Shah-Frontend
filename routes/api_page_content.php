<?php

use App\Http\Controllers\Api\PageContentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Page Content API Routes
|--------------------------------------------------------------------------
|
| Add these routes to your routes/api.php file
|
*/

// Public routes (no authentication required)
Route::get('/hero-sections', [PageContentController::class, 'getLandingPage']);
Route::get('/content/landing', [PageContentController::class, 'getLandingPage']);
Route::get('/content/brand/{slug}', [PageContentController::class, 'getBrandPage']);

// Admin routes (require authentication)
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    Route::get('/page-contents', [PageContentController::class, 'index']);
    Route::get('/page-contents/{pageKey}', [PageContentController::class, 'show']);
    Route::post('/page-contents', [PageContentController::class, 'store']);
    Route::put('/page-contents/{pageKey}', [PageContentController::class, 'update']);
    Route::delete('/page-contents/{pageKey}', [PageContentController::class, 'destroy']);
    
    // Alias for hero-sections (for backward compatibility)
    Route::get('/hero-sections', [PageContentController::class, 'show'])->defaults('pageKey', 'home');
    Route::post('/hero-sections', function (Request $request) {
        return app(PageContentController::class)->update($request, 'home');
    });
});
