package main

import (
	"fmt"
	"os"
)

func main() {
	fmt.Println("Hello World")
	file, err := os.Create("go-test.txt")
	if err != nil {
		panic(err)
	}
	defer file.Close()
	for i := 0; i < 10000; i++ {
		fmt.Fprintf(file, string(i))
	}
}
