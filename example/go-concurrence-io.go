package main

import "fmt"

type test struct {
	name string
	age  int
}

func (t test) testMethod() string {
	return t.name + string(t.age)
}

func main() {
	hha := test{"hsdfsjdfhskfj", 15}
	fmt.Println(hha.testMethod())
}
