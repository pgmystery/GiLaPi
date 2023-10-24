package main

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	createAPIs(app)

	err := app.Listen(":3001")

	if err != nil {
		fmt.Println(err)
		return
	}
}
