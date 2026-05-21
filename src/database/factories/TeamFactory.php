<?php

namespace Database\Factories;

use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Team>
 */
class TeamFactory extends Factory
{
    protected $model = Team::class;

    public function definition(): array
    {
        return [
            'name'        => fake()->company(),
            'is_personal' => false,
        ];
    }

    public function personal(): static
    {
        return $this->state(['is_personal' => true]);
    }
}
