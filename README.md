## Notex backend

#### Description

This project is one peace of the hole project. It is responsible for handling serverside logic and interaction with database. In addition, it handles authorization.

#### Folder and logical project structure

-   `/dist` compiled production code
-   `/src` **MAIN** source code
    -   `/controllers` routers for express app
    -   `/models` mongoose schema/models
    -   `/modules` testable/modular actions for altering mongo db
    -   `/types` typescript interfaces
    -   `/utils` other functions that are independent agains dependencies
    -   `/validation` validation util functions
-   `/tests` all test files grouped in a single directory
-   `<root>/*` mainly config files needed to run the app

Basically, `index.ts` collects all the routes from `/controllers` folder. Next, controllers validify the request body and uses `/modules` to perform mongo query. Next, `/modules` uses mongoose models defined in `/models`.

In other words, this flow looks like this:
**index.ts -> controllers -> modules -> models**
