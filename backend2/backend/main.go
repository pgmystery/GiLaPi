package main

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	createAPIs(app)

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello world!")
	})

	err := app.Listen(":3001")

	if err != nil {
		fmt.Println(err)
		return
	}
}
