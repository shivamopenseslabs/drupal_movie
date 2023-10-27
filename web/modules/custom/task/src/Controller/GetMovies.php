<?php

namespace Drupal\task\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\taxonomy\Entity\Term;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class GetMovies extends ControllerBase
{

    public function getMovies(Request $request)
    {
        $page = $request->query->get('page');
        $categoryFilter = $request->query->get('categoryFilter');
        $nameFilter = $request->query->get('name'); // Get the "name" parameter.
        $resource_type = 'node';
        $bundle = 'movies'; // Replace with your actual content type name.
        $pagesize = 2; // Two items per page.

        $query = \Drupal::entityQuery($resource_type)
            ->condition('type', $bundle)
            ->accessCheck(FALSE);

        // Apply category filter if provided.
        if (!empty($categoryFilter)) {
            $query->condition('field_category', $categoryFilter);
        }

        // Apply name filter if provided.
        if (!empty($nameFilter)) {
            $query->condition('title', '%' . $nameFilter . '%', 'LIKE');
        }

        // Get an array of entity IDs.
        $entity_ids = $query->execute();

        if (empty($entity_ids)) {
            // Return a custom response when no results are found.
            return new JsonResponse(['message' => 'No results found']);
        }

        // Calculate the total number of pages.
        $total_pages = ceil(count($entity_ids) / $pagesize);

        // Ensure the requested page number is within valid bounds.
        $page = min(max($page, 1), $total_pages);

        $offset = ($page - 1) * $pagesize;

        // Update the query to include the range.
        $query->range($offset, $pagesize);
        $entity_ids = $query->execute();

        // Load the full entities based on the IDs.
        $entities = \Drupal::entityTypeManager()->getStorage($resource_type)->loadMultiple($entity_ids);

        $response_data = [];
        foreach ($entities as $entity) {
            // Extract the desired field values from the entity.
            $movie_cost = $entity->get('field_movie_cost')->value;
            $total_seats_booked = $entity->get('field_total_b')->value;
            $total_seats = $entity->get('field_total_seats')->value;
            $category_tid = $entity->get('field_category')->target_id;
            $category = '';
            $movie_name = $entity->getTitle(); // Title field is used for the movie name.
            $movie_image = $entity->get('field_movie_image')->value;

            // Load the taxonomy term based on the target ID.
            if (!empty($category_tid)) {
                $term = Term::load($category_tid);
                if ($term) {
                    $category = $term->getName();
                }
            }

            // Create an array with the extracted values.
            $response_data[] = [
                'movie_cost' => $movie_cost,
                'total_seats_booked' => $total_seats_booked,
                'total_seats' => $total_seats,
                'category' => $category,
                'name' => $movie_name,
                'image'=> $movie_image,
            ];
        }

        // Return the response data along with the total pages.
        $response = [
            'data' => $response_data,
            'total_pages' => $total_pages,
        ];

        return new JsonResponse($response);
    }
    public function getCategories(Request $request)
    {
        // Load all taxonomy terms from the "Movies Category" vocabulary.
        $vid = 'movies_category'; // Replace with the actual vocabulary machine name.
        $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid);

        $categories = [];
        foreach ($terms as $term) {
            // Load the taxonomy term entity to access its properties.
            $taxonomy_term = Term::load($term->tid);

            // Check if the term exists.
            if ($taxonomy_term) {
                $categories[] = [
                    'id' => $taxonomy_term->id(),
                    'name' => $taxonomy_term->getName(),
                ];
            }
        }

        // Return the categories as a JSON response.
        return new JsonResponse($categories);
    }
}
