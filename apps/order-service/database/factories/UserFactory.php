<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $first = $this->faker->firstName;
        $last = $this->faker->lastName;
        $username = Str::slug($first . '.' . $last) . rand(100, 999);

        return [
            'first_name' => $first,
            'last_name' => $last,
            'username' => $username,
            'email' => $this->faker->unique()->safeEmail,
            'type' => 'user',  // or 'admin' if needed
            'status' => 'active',  // or 'inactive'
            'avatar' => $this->faker->imageUrl(100, 100, 'people', true, 'User'),
            'phone' => $this->faker->phoneNumber,
            'address' => $this->faker->streetAddress,
            'city' => $this->faker->city,
            'state' => $this->faker->state,
            'zip' => $this->faker->postcode,
            'country' => $this->faker->country,
            'timezone' => $this->faker->timezone,
            'email_verified_at' => now(),
            'password' => Hash::make('password'),  // Use bcrypt for real apps
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
