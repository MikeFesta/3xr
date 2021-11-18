# 3xr
Open sourced code from 3XR Inc (2019-2021)

SPDX-License-Identifier: Apache-2.0

## About
3XR Inc was a venture-backed startup that I founded and ran from 2019-2021. The company’s purpose was to help brands create 3D models of their products for XR (augmented reality, virtual reality, 3D web, spatial computing, metaverse).

The company was too early for its time and unable to find a scalable business model before running out of funding.

This repository is a collection of most of the software that was written as part of the 3XR platform. It is being open sourced so that it may be of use to others working to digitize the world as the internet evolves from 2D to 3D.

### Authors
**Primary Author:** Mike Festa

**Contributors:**
- Sam De Lara
- Danielle Festa
- Alen Kis
- Nick Odumo


### Repository Organization
Each directory contains project that originally had its own repository.

**Projects**
- **bash**: Shell scripts for backend processing, including moving files, conversions, and running blender scripts.
- **blender-add-on**: An add-on for Blender that performs validation, texture baking, and synchronization with 3xr.com.
- **blender-processing-scripts**: Python scripts that run inside of blender, typcially run from headless servers to process and export 3D models.
- **database**: Postgres schema used by the 3xr.com backend. 
- **rabbit-mq**: Files to process messages exchanged on Rabbit Message Queue. Mostly just calls scripts in the bash project.
- **website-backend**: NodeJS + Express backend for 3xr.com, which runs inside a docker container. Written in typescript.
- **website-frontend**: VueJS 2 front-end for 3xr.com. Written in typescript and uses pug templates.
- **website-services**: NodeJS + Express backend for endpoints related to files access by the processing network, also runs inside a docker container. Written in typescript.
- **website-types**: Typescript type definitions (index.d.ts) and enumerations common to the front and backends.
