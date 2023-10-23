package routes

import "github.com/gofiber/fiber/v2"

func setSetup(ctx *fiber.Ctx) error {

}

func SetupRouter(setupRouter fiber.Router) {
	setupRouter.Post("/", setSetup)
}
