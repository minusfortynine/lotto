/*
 * Command-line Lotto Number Generator in Standard C
 *
 * Usage: ./lotto <how_many> <out_of> <sets>
 * Example: ./lotto 6 45 3   -> generates 3 sets of 6 numbers from 1-45
 *
 * All memory is stack-allocated, no heap usage, highly portable.
 */

#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <assert.h>

#ifdef __unix__
#include <unistd.h>   /* For getpid() on Unix-like systems */
#endif

/* Maximum supported 'out_of' value (limits stack array size) */
#define MAX_OUT_OF 100
#define MAX_SETS   100  /* Reasonable upper limit for number of sets */

/**
 * Generates one set of 'how_many' unique random numbers from 1 to 'out_of',
 * sorted in ascending order.
 *
 * @param how_many  Numbers to pick
 * @param out_of    Total pool size
 * @param result    Output array (must hold at least 'how_many' ints)
 * @return          1 on success, 0 on invalid parameters
 */
int generate_lotto_numbers(int how_many, int out_of, int result[])
{
    /* Development-time checks */
    assert(how_many > 0);
    assert(out_of >= how_many);
    assert(out_of <= MAX_OUT_OF);

    /* Runtime validation */
    if (how_many <= 0 || out_of < how_many || out_of > MAX_OUT_OF) {
        return 0;
    }

    int pool[MAX_OUT_OF];

    /* Initialize pool with numbers 1 to out_of */
    for (int i = 0; i < out_of; i++) {
        pool[i] = i + 1;
    }

    /* Select 'how_many' numbers without replacement (Fisher-Yates style) */
    for (int i = 0; i < how_many; i++) {
        int remaining = out_of - i;
        int rand_index = rand() % remaining;

        result[i] = pool[rand_index];

        /* Remove selected number by overwriting with last element */
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
 * Prints a single lotto set with nice formatting.
 */
void print_lotto_set(const int numbers[], int count)
{
    for (int i = 0; i < count; i++) {
        if (i > 0) printf("  ");
        printf("%2d", numbers[i]);
    }
    printf("\n");
}

/**
 * Prints usage information and exits.
 */
void print_usage(const char *program_name)
{
    fprintf(stderr, "Usage: %s <how_many> <out_of> <sets>\n", program_name);
    fprintf(stderr, "Example: %s 6 45 3\n", program_name);
    fprintf(stderr, "  how_many : number of lucky numbers (e.g. 6 or 7)\n");
    fprintf(stderr, "  out_of   : total numbers to choose from (e.g. 45 or 49)\n");
    fprintf(stderr, "  sets     : how many lines to generate\n");
    fprintf(stderr, "\nConstraints:\n");
    fprintf(stderr, "  1 <= how_many <= out_of <= %d\n", MAX_OUT_OF);
    fprintf(stderr, "  1 <= sets <= %d\n", MAX_SETS);
}

int main(int argc, char *argv[])
{
    /* Check for correct number of arguments */
    if (argc != 4) {
        print_usage(argv[0]);
        return 1;
    }

    /* Parse command-line arguments */
    int how_many = atoi(argv[1]);
    int out_of   = atoi(argv[2]);
    int sets     = atoi(argv[3]);

    /* Validate parsed values */
    if (how_many <= 0 || out_of < how_many || out_of > MAX_OUT_OF ||
        sets <= 0 || sets > MAX_SETS) {
        fprintf(stderr, "Error: Invalid parameters.\n");
        print_usage(argv[0]);
        return 1;
    }

    /* Seed the random number generator.
     * We combine time() with getpid() when available to make concurrent
     * runs less likely to get the same sequence. rand() itself is not
     * cryptographically secure, but perfectly fine for lotto fun.
     */
    unsigned int seed = (unsigned int)time(NULL);

#ifdef __unix__
    seed ^= (unsigned int)getpid();
#endif

    srand(seed);

    printf("Generating %d set%s of %d numbers from 1 to %d:\n\n",
           sets, sets == 1 ? "" : "s", how_many, out_of);

    int lucky_numbers[how_many];  /* Stack buffer for one set */

    for (int i = 0; i < sets; i++) {
        int success = generate_lotto_numbers(how_many, out_of, lucky_numbers);
        if (!success) {
            fprintf(stderr, "Error: Failed to generate numbers (should not happen).\n");
            return 1;
        }
        print_lotto_set(lucky_numbers, how_many);
    }

    return 0;
}
