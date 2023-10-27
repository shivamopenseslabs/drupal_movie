<?php

namespace Drupal\task\Plugin\rest\resource;

use Drupal\taxonomy\Entity\Term;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Provides a REST resource to retrieve all fields of the Employee content type with pagination.
 *
 * @RestResource(
 *   id = "all_apis",
 *   label = @Translation("All Apis"),
 *   uri_paths = {
 *     "canonical" = "/get",
 *   },
 *   no_cache = TRUE, 
 * )
 */

class GetMovies extends ResourceBase
{
  /**
   * Responds to GET requests with pagination support.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The incoming request object.
   *
   * @return \Drupal\rest\ResourceResponse
   */
  public function get(Request $request)
  {
    $resource_type = 'node';
    $bundle = 'movies'; // Replace with your actual content type name.

    $page = max($request->query->get('page', 1), 1); // Default to page 1 if not provided.
    $pagesize = 2; // Two items per page.

    // Count the total number of nodes of the specified content type.
    $total_nodes = \Drupal::entityQuery($resource_type)
      ->condition('type', $bundle)
      ->accessCheck(FALSE)
      ->count()
      ->execute();

    // Calculate the total number of pages.
    $total_pages = ceil($total_nodes / $pagesize);

    // Ensure the requested page number is within valid bounds.
    $page = min(max($page, 1), $total_pages);

    $offset = ($page - 1) * $pagesize;

    // Load all entities of the specified content type with pagination.
    $query = \Drupal::entityQuery($resource_type)
      ->condition('type', $bundle)
      ->accessCheck(FALSE)
      ->range($offset, $pagesize);
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

      // Load the taxonomy term based on the target ID.
      if (!empty($category_tid)) {
        $term = Term::load($category_tid);
        if ($term) {
          $category = $term->getName();
        }
      }

      // Calculate the "seats left" field if it's a computed value.

      // Create an array with the extracted values.
      $response_data[] = [
        'movie_cost' => $movie_cost,
        'total_seats_booked' => $total_seats_booked,
        'total seats' => $total_seats,
        'category' => $category,
        'name' => $movie_name,
      ];
    }

    // Return the response data along with the total pages.
    $response = [
      'data' => $response_data,
      'total_pages' => $total_pages,
    ];

    return new ResourceResponse($response);
  }
}
