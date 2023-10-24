package routes

import (
	"gilapi/backend/api/v1/crud"
	"gilapi/backend/api/v1/schemas"
	"github.com/gofiber/fiber/v2"
)

// https://github.com/gofiber/recipes/blob/master/mongodb/main.go

func setSetup(ctx *fiber.Ctx) error {
	setupSchema := new(schemas.Setup)

	if err := ctx.BodyParser(setupSchema); err != nil {
		return ctx.Status(400).SendString(err.Error())
	}

	setupCrud := new(crud.Setup)
	setupCrud.Create()
}

func SetupRouter(setupRouter fiber.Router) {
	setupRouter.Post("/", setSetup)
}
