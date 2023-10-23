package main

import (
	v1Routes "gilapi/backend/api/v1"
	"github.com/gofiber/fiber/v2"
)

func createAPIs(app *fiber.App) {
	api := app.Group("/api")

	v1 := api.Group("/v1", func(ctx *fiber.Ctx) error {
		ctx.Set("Version", "v1")

		return ctx.Next()
	})
	v1Routes.CreateRoutes(v1)
}
