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

}
