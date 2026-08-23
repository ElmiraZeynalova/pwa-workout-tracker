-- CreateTable
CREATE TABLE "app_users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "workout_id" UUID DEFAULT gen_random_uuid(),

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routine_exercises" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "routine_id" UUID DEFAULT gen_random_uuid(),

    CONSTRAINT "routine_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routine_sets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "reps" DECIMAL NOT NULL,
    "weight" REAL,
    "routine_exercise_id" UUID DEFAULT gen_random_uuid(),

    CONSTRAINT "routine_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routines" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "user_id" UUID DEFAULT gen_random_uuid(),
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "routines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "exercise_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "reps" INTEGER,
    "weight" REAL,

    CONSTRAINT "sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workouts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "date" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "app_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "workouts_date_key" ON "workouts"("date");

-- CreateIndex
CREATE UNIQUE INDEX "unique_user_date" ON "workouts"("user_id", "date");

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workouts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "routine_exercises" ADD CONSTRAINT "routine_exercises_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "routines"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "routine_sets" ADD CONSTRAINT "routine_sets_routine_exercise_id_fkey" FOREIGN KEY ("routine_exercise_id") REFERENCES "routine_exercises"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "routines" ADD CONSTRAINT "routines_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sets" ADD CONSTRAINT "sets_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
