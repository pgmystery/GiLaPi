package v1

import (
	APIRoutes "gilapi/backend/api/v1/routes"
	"github.com/gofiber/fiber/v2"
)

func CreateRoutes(api fiber.Router) {
	setupRoute := api.Group("/setup")
	APIRoutes.SetupRouter(setupRoute)
}
