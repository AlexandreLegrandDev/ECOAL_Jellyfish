<?php

namespace Database\Seeders;

use App\Models\Collection;
use App\Models\CriteriaField;
use App\Models\CriteriaFieldValue;
use App\Models\Jellyfish;
use App\Models\Location;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
    Schema::disableForeignKeyConstraints();
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        Collection::factory()->create([
            'id_user' => 1,
            'name' => 'Necklace',
            'description' => 'My super collection',
            'img' => 'https://upload.wikimedia.org/wikipedia/commons/4/44/Jelly_cc11.jpg',
            'status' => 0,

        ]);

        CriteriaField::factory()->create([
            'name' => 'Size',
        ]);

        CriteriaField::factory()->create([
            'name' => 'Diameter',
        ]);

        CriteriaField::factory()->create([
            'name' => 'Bioluminescent',
        ]);

        CriteriaField::factory()->create([
            'name' => 'Dangerosity',
        ]);

        CriteriaFieldValue::factory()->create([
            'id_jellyfish' => 1,
            'id_criteria_fields' => 1,
            'value' => 10,
        ]);

        CriteriaFieldValue::factory()->create([
            'id_jellyfish' => 1,
            'id_criteria_fields' => 2,
            'value' => 25,
        ]);

        CriteriaFieldValue::factory()->create([
            'id_jellyfish' => 1,
            'id_criteria_fields' => 3,
            'value' => 0,
        ]);

        CriteriaFieldValue::factory()->create([
            'id_jellyfish' => 1,
            'id_criteria_fields' => 4,
            'value' => 1,
        ]);

        CriteriaFieldValue::factory()->create([
            'id_jellyfish' => 2,
            'id_criteria_fields' => 1,
            'value' => 300,
        ]);

        CriteriaFieldValue::factory()->create([
            'id_jellyfish' => 2,
            'id_criteria_fields' => 2,
            'value' => 30,
        ]);

        CriteriaFieldValue::factory()->create([
            'id_jellyfish' => 2,
            'id_criteria_fields' => 3,
            'value' => 0,
        ]);

        CriteriaFieldValue::factory()->create([
            'id_jellyfish' => 2,
            'id_criteria_fields' => 4,
            'value' => 10,
        ]);

        CriteriaFieldValue::factory()->create([
            'id_jellyfish' => 3,
            'id_criteria_fields' => 1,
            'value' => 20,
        ]);

        CriteriaFieldValue::factory()->create([
            'id_jellyfish' => 3,
            'id_criteria_fields' => 2,
            'value' => 15,
        ]);

        CriteriaFieldValue::factory()->create([
            'id_jellyfish' => 3,
            'id_criteria_fields' => 3,
            'value' => 1,
        ]);

        CriteriaFieldValue::factory()->create([
            'id_jellyfish' => 3,
            'id_criteria_fields' => 4,
            'value' => 3,
        ]);

        CriteriaFieldValue::factory()->create([
            'id_jellyfish' => 4,
            'id_criteria_fields' => 1,
            'value' => 3500,
        ]);

        CriteriaFieldValue::factory()->create([
            'id_jellyfish' => 4,
            'id_criteria_fields' => 2,
            'value' => 200,
        ]);

        CriteriaFieldValue::factory()->create([
            'id_jellyfish' => 4,
            'id_criteria_fields' => 3,
            'value' => 0,
        ]);

        CriteriaFieldValue::factory()->create([
            'id_jellyfish' => 4,
            'id_criteria_fields' => 4,
            'value' => 7,
        ]);

        Jellyfish::factory()->create([
            'id_collection' => 1,
            'name' => 'Méduse Lune',
            'img' => 'https://www.nausicaa.fr/sites/default/files/styles/cm_545x705/public/paragraphs/animal_identity/2023-06/Meduse%20aurelie-H-Hillewaert%20ID.jpg.webp?itok=l2phvklA',
            'depth' => 1,
        ]);

        Jellyfish::factory()->create([
            'id_collection' => 1,
            'name' => 'Guêpe de Mer',
            'img' => 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Avispa_marina.jpg',
            'depth' => 1,
        ]);

        Jellyfish::factory()->create([
            'id_collection' => 1,
            'name' => 'Méduse Atolla',
            'img' => 'https://upload.wikimedia.org/wikipedia/commons/6/60/Atolla_wyvillei.jpg',
            'depth' => 2,
        ]);

        Jellyfish::factory()->create([
            'id_collection' => 1,
            'name' => 'Crinière de Lion',
            'img' => 'https://upload.wikimedia.org/wikipedia/commons/2/22/Largelionsmanejellyfish.jpg',
            'depth' => 1,
        ]);

        Location::factory()->create([
            'id_jellyfish' => 1,
            'long' => 43.29,
            'lat' => 5.36,
        ]);

        Location::factory()->create([
            'id_jellyfish' => 2,
            'long' => -16.92,
            'lat' => 145.77,
        ]);

        Location::factory()->create([
            'id_jellyfish' => 3,
            'long' => -34.60,
            'lat' => 18.47,
        ]);

        Location::factory()->create([
            'id_jellyfish' => 4,
            'long' => 60.16,
            'lat' => 24.93,
        ]);
    }
}
