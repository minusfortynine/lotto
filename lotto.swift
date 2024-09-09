import Foundation

func lotto(_ howMany: Int, outOf: Int) -> [Int] {
    // Create an array of numbers from 1 to outOf
    var numbers = Array(1...outOf)
    
    // Array to hold the lucky numbers
    var luckyNumbers = [Int]()
    
    for _ in 1...howMany {
        // Ensure we don't go out of bounds
        if numbers.isEmpty {
            break
        }
        let randomIndex = Int(arc4random_uniform(UInt32(numbers.count)))
        let luckyNumber = numbers.remove(at: randomIndex)
        luckyNumbers.append(luckyNumber)
    }
    
    // Sort the lucky numbers
    return luckyNumbers.sorted()
}

// Call the lotto function three times
for _ in 1...3 {
    let result = lotto(6, outOf: 45)
    print(result)
}
