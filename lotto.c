/*
 * Simple Lotto Number Generator in Standard C
 *
 * This program generates random lottery numbers without replacement,
 * similar to the provided JavaScript version.
 * It selects 'how_many' unique numbers from 1 to 'out_of',
 * sorts them in ascending order, and prints multiple sets.
 *
 * Key constraints respected:
 * - Only stack memory used (fixed-size arrays)
 * - No pointers (except for minimal array parameter passing)
 * - No heap allocation (no malloc/free)
 * - No global variables
 * - Standard C (C99/C11 compatible)
 * - Assertions for development-time checks
 * - Clear documentation and consistent naming
 * - Simple, readable expressions
 */

#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <assert.h>

/* Maximum possible value for 'out_of' - determines array size on stack */
#define MAX_OUT_OF 100

/**
 * Generates 'how_many' unique random numbers from 1 to 'out_of',
 * sorted in ascending order.
 *
 * @param how_many   Number of lucky numbers to pick (e.g., 6)
 * @param out_of     Total numbers available (e.g., 45)
 * @param result     Array where sorted lucky numbers will be stored
 *                   Must have space for at least 'how_many' elements
 * @return           1 on success, 0 on failure (invalid parameters)
 */
int generate_lotto_numbers(int how_many, int out_of, int result[])
{
    /* Input validation with assertions (active in debug builds) */
    assert(how_many > 0);
    assert(out_of >= how_many);
    assert(out_of <= MAX_OUT_OF);

    /* Early return if parameters are clearly invalid */
    if (how_many <= 0 || out_of < how_many || out_of > MAX_OUT_OF) {
        return 0;
    }

    /* Pool of available numbers (1 to out_of) - stored on stack */
    int pool[MAX_OUT_OF];
    int pool_size = 0;

    for (int i = 1; i <= out_of; i++) {
        pool[pool_size] = i;
        pool_size++;
    }

    /* Select 'how_many' numbers without replacement */
    int lucky_index = 0;
    for (int i = 0; i < how_many; i++) {
        /* Remaining numbers at this step */
        int remaining = out_of - i;
        /* Random index in current pool */
        int rand_index = rand() % remaining;

        /* Pick the number */
        result[lucky_index] = pool[rand_index];
        lucky_index++;

        /* Remove picked number by overwriting with last element */
        pool[rand_index] = pool[remaining - 1];
    }

    /* Simple bubble sort on the selected numbers */
    for (int i = 0; i < how_many - 1; i++) {
        for (int j = 0; j < how_many - 1 - i; j++) {
            if (result[j] > result[j + 1]) {
                int temp = result[j];
                result[j] = result[j + 1];
                result[j + 1] = temp;
            }
        }
    }

    return 1;
}

/**
 * Prints a list of numbers in a clean format.
 */
void print_lotto_set(const int numbers[], int count)
{
    for (int i = 0; i < count; i++) {
        if (i > 0) {
            printf(" ");
        }
        printf("%2d", numbers[i]);
    }
    printf("\n");
}

int main(void)
{
    /* Seed the random number generator once */
    srand((unsigned int)time(NULL));

    const int how_many = 6;
    const int out_of   = 45;
    const int sets     = 3;  /* Number of lotto lines to generate */

    printf("Generating %d sets of %d numbers from 1 to %d:\n\n", sets, how_many, out_of);

    int lucky_numbers[how_many];  /* Stack-allocated result buffer */

    for (int i = 0; i < sets; i++) {
        int success = generate_lotto_numbers(how_many, out_of, lucky_numbers);
        if (success) {
            print_lotto_set(lucky_numbers, how_many);
        } else {
            fprintf(stderr, "Error: Invalid parameters for lotto generation.\n");
            return 1;
        }
    }

    return 0;
}
