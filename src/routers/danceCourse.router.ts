import createDebug from "debug";
import { Router as createRouter } from "express";
import { Repository } from "../repository/repository.js";
import { DanceCourse } from "../entities/danceCourse.js";
import { DanceCourseRepo } from "../repository/danceCourse.mongo.repository.js";
import { UserRepo } from "../repository/user.mongo.repository.js";
import { DanceCourseController } from "../controllers/danceCourse.controller.js";
import { AuthInterceptor } from "../middleware/auth.interceptor.js";
import { User } from "../entities/user.js";

const debug = createDebug("PF: DanceCourseRouter");

debug("Executed");

const danceCourseRepo: Repository<DanceCourse> = new DanceCourseRepo();
const userRepo: Repository<User> = new UserRepo();
const controller = new DanceCourseController(danceCourseRepo, userRepo);
const interceptor = new AuthInterceptor(danceCourseRepo);
export const danceCourseRouter = createRouter();

danceCourseRouter.get('/', controller.query.bind(controller));

danceCourseRouter.get('/id', controller.queryById.bind(controller));

danceCourseRouter.post(
  '/',
  interceptor.logged.bind(interceptor),
  controller.post.bind(controller)
);

danceCourseRouter.patch(
  '/:id',
  // interceptor.logged.bind(interceptor),
  // interceptor.authorizedDanceCourses.bind(interceptor),
  controller.update.bind(controller)
);

danceCourseRouter.delete(
  '/:id',
  interceptor.logged.bind(interceptor),
  interceptor.authorizedDanceCourses.bind(interceptor),
  controller.delete.bind(controller)
);