<?php

namespace Drupal\task\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class GetApis extends ControllerBase
{

    public function getMovies(Request $request)
    {
        $categoryFilter = $request->query->get('category');
        $nameFilter = $request->query->get('name'); // Get the "name" query parameter.
        $page = $request->query->get('page', 1); // Get the "page" query parameter with a default value of 1.

        $itemsPerPage = 2; // Define the number of items per page.

        $query = \Drupal::entityQuery('node')
            ->condition('type', 'movies')
            ->accessCheck(FALSE);

        $entity_ids = $query->execute();

        if (empty($entity_ids)) {
            // Return a custom response when no results are found.
            return new JsonResponse(['message' => 'No results found']);
        }

        // Calculate the total number of pages.
        $total_pages = ceil(count($entity_ids) / $itemsPerPage);

        if (!empty($categoryFilter) && $categoryFilter !== 'All' && $categoryFilter !== 'all' ) {
            $categories = explode(',', $categoryFilter);

            if (!empty($categories)) {
                $orCondition = $query->orConditionGroup();

                foreach ($categories as $category) {
                    $term = \Drupal::entityTypeManager()
                        ->getStorage('taxonomy_term')
                        ->loadByProperties(['name' => $category]);

                    if (!empty($term)) {
                        $term = reset($term);
                        $orCondition->condition('field_category', $term->id());
                    }
                }

                $query->condition($orCondition);
            }
        }

        if (!empty($nameFilter)) {
            $query->condition('title', $nameFilter, 'LIKE'); // Filter by movie name.
        }

        // Check if either category or name parameter is present; if yes, disable pagination.
        if (!empty($categoryFilter) || !empty($nameFilter)) {
            $itemsPerPage = 0; // Disable pagination.
        } else {
            // Calculate the offset to fetch the desired page of data.
            $offset = ($page - 1) * $itemsPerPage;
            // Set the range for the query to fetch a specific chunk of data.
            $query->range($offset, $itemsPerPage);
        }

        $entity_ids = $query->execute();
        $entities = \Drupal::entityTypeManager()
            ->getStorage('node')
            ->loadMultiple($entity_ids);

        $response_data = [];

        foreach ($entities as $entity) {
            $movie_cost = $entity->get('field_movie_cost')->value;
            $total_seats_booked = $entity->get('field_total_b')->value;
            $total_seats = $entity->get('field_total_seats')->value;
            $category_tid = $entity->get('field_category')->target_id;
            $category = '';
            $movie_name = $entity->getTitle();
            $movie_image = $entity->get('field_movie_image')->value;

            if (!empty($category_tid)) {
                $term = \Drupal::entityTypeManager()
                    ->getStorage('taxonomy_term')
                    ->load($category_tid);

                if ($term) {
                    $category = $term->getName();
                }
            }

            $response_data[] = [
                'movie_cost' => $movie_cost,
                'total_seats_booked' => $total_seats_booked,
                'total_seats' => $total_seats,
                'category' => $category,
                'name' => $movie_name,
                'movie_image' => $movie_image,
            ];
        }

        $response = [
            'data' => $response_data,
            'total_pages' => $total_pages,
        ];

        return new JsonResponse($response);
    }
}
