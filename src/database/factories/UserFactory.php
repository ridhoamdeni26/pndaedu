<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name'                       => fake()->name(),
            'email'                      => fake()->unique()->safeEmail(),
            'phone'                      => fake()->numerify('08##########'),
            'password'                   => static::$password ??= Hash::make('password'),
            'role'                       => 'student',
            'status'                     => 'active',
            'avatar'                     => null,
            'email_verified_at'          => now(),
            'last_login_at'              => null,
            'remember_token'             => Str::random(10),
            'two_factor_secret'          => null,
            'two_factor_recovery_codes'  => null,
            'two_factor_confirmed_at'    => null,
        ];
    }

    public function owner(): static    { return $this->state(['role' => 'owner']); }
    public function admin(): static    { return $this->state(['role' => 'admin']); }
    public function teacher(): static  { return $this->state(['role' => 'teacher']); }
    public function student(): static  { return $this->state(['role' => 'student']); }
    public function inactive(): static { return $this->state(['status' => 'inactive']); }
    public function suspended(): static { return $this->state(['status' => 'suspended']); }

    public function unverified(): static
    {
        return $this->state(['email_verified_at' => null]);
    }

    public function withTwoFactor(): static
    {
        return $this->state([
            'two_factor_secret'          => encrypt('secret'),
            'two_factor_recovery_codes'  => encrypt(json_encode(['recovery-code-1'])),
            'two_factor_confirmed_at'    => now(),
        ]);
    }
}
