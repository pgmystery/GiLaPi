package main

import (
	v1Routes "gilapi/backend/api/v1"
	"gilapi/backend/config"
	"github.com/gofiber/fiber/v2"
)

func createAPIs(app *fiber.App) {
	api := app.Group("/api")

	v1 := api.Group("/v1", func(ctx *fiber.Ctx) error {
		configData := config.LoadConfig()

		ctx.Set("Version", "v1")
		ctx.Locals("Config", configData)

		return ctx.Next()
	})
	v1Routes.CreateRoutes(v1)
}
