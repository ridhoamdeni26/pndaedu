<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Seeds realistic users for all four roles.
 * All accounts use password: "password"
 *
 * Roles:    owner × 1 | admin × 2 | teacher × 3 | student × 10
 * Statuses: 15 active | 1 inactive (Sari) | 1 suspended (Doni)
 */
class UserSeeder extends Seeder
{
    public function run(): void
    {
        /* ── Owner ─────────────────────────────────────────────── */
        User::factory()->owner()->create([
            'name'  => 'Owner Panda Mandarin',
            'email' => 'owner@pandamandarin.id',
            'phone' => '081234567800',
        ]);

        /* ── Admins ────────────────────────────────────────────── */
        $admins = [
            ['name' => 'Admin MOI',   'email' => 'admin.moi@pandamandarin.id',   'phone' => '081234567801'],
            ['name' => 'Admin Pluit', 'email' => 'admin.pluit@pandamandarin.id', 'phone' => '081234567802'],
        ];

        foreach ($admins as $data) {
            User::factory()->admin()->create($data);
        }

        /* ── Teachers ──────────────────────────────────────────── */
        $teachers = [
            ['name' => 'Chen Wei',   'email' => 'chen.wei@pandamandarin.id',   'phone' => '081234567803'],
            ['name' => 'Li Mei',     'email' => 'li.mei@pandamandarin.id',     'phone' => '081234567804'],
            ['name' => 'Wang Fang',  'email' => 'wang.fang@pandamandarin.id',  'phone' => '081234567805'],
        ];

        foreach ($teachers as $data) {
            User::factory()->teacher()->create($data);
        }

        /* ── Students ──────────────────────────────────────────── */
        $students = [
            ['name' => 'Kevin Pratama',   'email' => 'kevin@gmail.com',   'phone' => '081234567810'],
            ['name' => 'Alicia Tanaka',   'email' => 'alicia@gmail.com',  'phone' => '081234567811'],
            ['name' => 'Bram Santoso',    'email' => 'bram@gmail.com',    'phone' => '081234567812'],
            ['name' => 'Nadia Kusuma',    'email' => 'nadia@gmail.com',   'phone' => '081234567813'],
            ['name' => 'Rizky Darmawan', 'email' => 'rizky@gmail.com',   'phone' => '081234567814'],
            ['name' => 'Cintia Wijaya',  'email' => 'cintia@gmail.com',  'phone' => '081234567815'],
            ['name' => 'Reza Putra',     'email' => 'reza@gmail.com',    'phone' => '081234567816'],
            ['name' => 'Maya Anggraini', 'email' => 'maya@gmail.com',    'phone' => '081234567817'],
        ];

        foreach ($students as $data) {
            User::factory()->student()->create($data);
        }

        // Inactive — belum bayar / tidak aktif
        User::factory()->student()->inactive()->create([
            'name'  => 'Sari Dewi',
            'email' => 'sari@gmail.com',
            'phone' => '081234567818',
        ]);

        // Suspended — melanggar peraturan
        User::factory()->student()->suspended()->create([
            'name'  => 'Doni Firmansyah',
            'email' => 'doni@gmail.com',
            'phone' => '081234567819',
        ]);
    }
}
