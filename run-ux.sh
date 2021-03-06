#!/usr/bin/env bash

# export FOLDER="/Users/lang/Develop/Source/vie-ui"
# 拷贝
# cp -r src/entity/* ${FOLDER}/src/entity
# cp -r src/economy/* ${FOLDER}/src/economy
# cp -r src/ux/* ${FOLDER}/src/ux
# echo "[ ${FOLDER} ] 拷贝完成！"
# export FOLDER="/Users/lang/Develop/Work/Source/ima-app"
# 拷贝
# cp -r src/entity/* ${FOLDER}/src/entity
# cp -r src/economy/* ${FOLDER}/src/economy
# cp -r src/ux/* ${FOLDER}/src/ux
# echo "[ ${FOLDER} ] 拷贝完成！"
export TARGET_FOLDER=/Users/lang/Develop/Source/ima-app/src
# 北京一体化项目
# cp -rf src/environment/* ${TARGET_FOLDER}/environment/
cp -rf src/economy/* ${TARGET_FOLDER}/economy/
cp -rf src/entity/* ${TARGET_FOLDER}/entity/
cp -rf src/ux/* ${TARGET_FOLDER}/ux/
# 资源文件
cp -rf src/cab/cn/shared.json ${TARGET_FOLDER}/cab/cn/shared.json
cp -rf src/cab/cn/economy/* ${TARGET_FOLDER}/cab/cn/economy/
cp -rf src/environment/zero.js ${TARGET_FOLDER}/environment/zero.js
# Others
echo "[ ${TARGET_FOLDER} ] 拷贝完成！"
export TARGET_FOLDER=/Users/lang/Develop/Source/vie-ui/src
# cp -rf src/environment/* ${TARGET_FOLDER}/environment/
cp -rf src/economy/* ${TARGET_FOLDER}/economy/
cp -rf src/entity/* ${TARGET_FOLDER}/entity/
cp -rf src/ux/* ${TARGET_FOLDER}/ux/
echo "[ ${TARGET_FOLDER} ] 拷贝完成！"
# 资源文件
cp -rf src/cab/cn/shared.json ${TARGET_FOLDER}/cab/cn/shared.json
cp -rf src/cab/cn/economy/* ${TARGET_FOLDER}/cab/cn/economy/
cp -rf src/environment/zero.js ${TARGET_FOLDER}/environment/zero.js
# Others
export TARGET_FOLDER=/Users/lang/Develop/Source/ox-ui/src
# cp -rf src/environment/* ${TARGET_FOLDER}/environment/
cp -rf src/economy/* ${TARGET_FOLDER}/economy/
cp -rf src/entity/* ${TARGET_FOLDER}/entity/
cp -rf src/ux/* ${TARGET_FOLDER}/ux/
echo "[ ${TARGET_FOLDER} ] 拷贝完成！"
# 资源文件
cp -rf src/cab/cn/shared.json ${TARGET_FOLDER}/cab/cn/shared.json
cp -rf src/cab/cn/economy/* ${TARGET_FOLDER}/cab/cn/economy/
cp -rf src/environment/zero.js ${TARGET_FOLDER}/environment/zero.js

