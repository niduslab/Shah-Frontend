<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PageContentController extends Controller
{
    /**
     * Get landing page content (Public)
     */
    public function getLandingPage()
    {
        try {
            $page = PageContent::where('page_key', 'home')
                ->where('is_active', true)
                ->first();

            if (!$page) {
                return response()->json([
                    'success' => false,
                    'error' => 'Landing page not found'
                ], 404);
            }

            $content = $page->content;

            return response()->json([
                'success' => true,
                'sections' => $content['heroSections'] ?? [],
                'preOrderSection' => $content['preOrderSection'] ?? null,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get brand page content (Public)
     */
    public function getBrandPage($slug)
    {
        try {
            $page = PageContent::where('page_key', $slug)
                ->where('page_type', 'brand')
                ->where('is_active', true)
                ->with('brand')
                ->first();

            if (!$page) {
                return response()->json([
                    'success' => false,
                    'error' => 'Brand page not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'page' => [
                        'pageKey' => $page->page_key,
                        'pageType' => $page->page_type,
                        'title' => $page->title,
                        'metaTitle' => $page->meta_title,
                        'metaDescription' => $page->meta_description,
                    ],
                    'brand' => $page->brand,
                    'content' => $page->content,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * List all page contents (Admin)
     */
    public function index(Request $request)
    {
        try {
            $query = PageContent::with('brand');

            // Filter by page type
            if ($request->has('page_type')) {
                $query->where('page_type', $request->page_type);
            }

            // Filter by active status
            if ($request->has('is_active')) {
                $query->where('is_active', $request->boolean('is_active'));
            }

            $pages = $query->orderBy('page_type')
                ->orderBy('title')
                ->get()
                ->map(function ($page) {
                    return [
                        'id' => $page->id,
                        'pageKey' => $page->page_key,
                        'pageType' => $page->page_type,
                        'title' => $page->title,
                        'brandId' => $page->brand_id,
                        'brandName' => $page->brand?->name,
                        'isActive' => $page->is_active,
                        'updatedAt' => $page->updated_at->toIso8601String(),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $pages,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get specific page content (Admin)
     */
    public function show($pageKey)
    {
        try {
            $page = PageContent::where('page_key', $pageKey)
                ->with('brand')
                ->first();

            if (!$page) {
                return response()->json([
                    'success' => false,
                    'error' => 'Page not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $page->id,
                    'pageKey' => $page->page_key,
                    'pageType' => $page->page_type,
                    'title' => $page->title,
                    'brandId' => $page->brand_id,
                    'brand' => $page->brand,
                    'content' => $page->content,
                    'metaTitle' => $page->meta_title,
                    'metaDescription' => $page->meta_description,
                    'isActive' => $page->is_active,
                    'createdAt' => $page->created_at->toIso8601String(),
                    'updatedAt' => $page->updated_at->toIso8601String(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update page content (Admin)
     */
    public function update(Request $request, $pageKey)
    {
        try {
            $page = PageContent::where('page_key', $pageKey)->first();

            if (!$page) {
                return response()->json([
                    'success' => false,
                    'error' => 'Page not found'
                ], 404);
            }

            // Validate request
            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'content' => 'sometimes|array',
                'meta_title' => 'sometimes|nullable|string|max:255',
                'meta_description' => 'sometimes|nullable|string',
                'is_active' => 'sometimes|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // Update page
            $updateData = $request->only(['title', 'content', 'meta_title', 'meta_description', 'is_active']);
            $updateData['updated_by'] = Auth::id();

            $page->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Page content updated successfully',
                'data' => $page,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create new page content (Admin)
     */
    public function store(Request $request)
    {
        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'page_key' => 'required|string|max:100|unique:page_contents,page_key',
                'page_type' => 'required|in:landing,brand',
                'title' => 'required|string|max:255',
                'brand_id' => 'nullable|exists:brands,id',
                'content' => 'required|array',
                'meta_title' => 'nullable|string|max:255',
                'meta_description' => 'nullable|string',
                'is_active' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // Create page
            $page = PageContent::create([
                'page_key' => $request->page_key,
                'page_type' => $request->page_type,
                'title' => $request->title,
                'brand_id' => $request->brand_id,
                'content' => $request->content,
                'meta_title' => $request->meta_title,
                'meta_description' => $request->meta_description,
                'is_active' => $request->is_active ?? true,
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Page content created successfully',
                'data' => $page,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete page content (Admin)
     */
    public function destroy($pageKey)
    {
        try {
            $page = PageContent::where('page_key', $pageKey)->first();

            if (!$page) {
                return response()->json([
                    'success' => false,
                    'error' => 'Page not found'
                ], 404);
            }

            $page->delete();

            return response()->json([
                'success' => true,
                'message' => 'Page content deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
