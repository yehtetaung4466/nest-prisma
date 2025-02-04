// // lazy-load.middleware.ts
// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { LazyModuleLoader } from '@nestjs/core';
// import { Request, Response, NextFunction } from 'express';
// import { ProductModule } from 'src/modules/product/product.module';
// import { S3Module } from 'src/core/s3/s3.module';
// import appRoutes from 'src/app.routes';

// @Injectable()
// export class LazyLoadMiddleware implements NestMiddleware {
//   private loadedModules = new Set();
//   private globalPrefix = '/api';

//   // Now supports multiple modules per route route
//   private readonly moduleMap = appRoutes

//   constructor(private lazyModuleLoader: LazyModuleLoader) {}

//   async use(req: Request, res: Response, next: NextFunction) {
//     console.log('middle ware run');
    
//     // console.log(req);
    
//     const path = req.baseUrl
    
    
    

//     for (const { route, modules } of this.moduleMap) {
//       // console.log(route);

      
      
//       if (path.startsWith(this.globalPrefix + route)) {
//         // console.log(route);
        
//         for (const module of modules) {
//           if (!this.loadedModules.has(module)) {
//             await this.lazyModuleLoader.load(() => module);
//             this.loadedModules.add(module);
//           }
//         }
//       }
//     }
//     console.log(this.loadedModules);
    
//     next();
//   }
// }