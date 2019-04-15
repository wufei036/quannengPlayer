#!/bin/bash

# 输入的包名

name="VideoPlayer"

echo "------SDK渠道包----------"

appName="${name}.app"

ipa="${name}.ipa"

# 打好包后输出的文件夹名字

outUpdateAppDir="ChannelPackages"

# 获取当前目录，并切换过去

currDir=${PWD}

cd ${currDir}

echo "-----${currDir}"

rm -rf Payload

#解压缩-o：覆盖文件 -q：不显示解压过程

unzip -o -q ${ipa}

#unzip -l ${ipa}

# 删除旧的文件，重新生成

rm -rf ${outUpdateAppDir}

mkdir ${outUpdateAppDir}

echo "------------------------开始打包程序------------------------"

# 渠道列表文件开始打包

for channel in "baidu" "dangle" "gfan" "goapk" "google" "huawei" "umeng" "wandoujia" "waps" "xiaomi" "yingyongbao"

do
#修改
wwwCommonJsFile=`find . -name "common.js"`
sedCondition="s/CHANNEL_NAME.*=.*'[a-zA-Z]*'/CHANNEL_NAME = '${channel}'/g"
sed -i "" "${sedCondition}" ${wwwCommonJsFile}         #替换web工程目录下的common.js文件中的CHANNEL_NAME变量的值
#sed -n 1,8p ${wwwCommonJsFile}  打印文件内容

#以下为企业签重签过程，本文不涉及

rm -rf Payload/${appName}/_CodeSignature

#cp AdHoc配置文件 替换 Payload/${appName}文件下的embedded.mobileprovision

cp ijuzi.mobileprovision "Payload/${appName}/embedded.mobileprovision"

#   ipa包签名： codesign -f -s "iPhone Distribution: Distribution证书名字，打开钥匙串可以看到" --entitlements "Entitlements.plist" "Payload/${appName}"

codesign -f -s "iPhone Distribution: Bizsmart web design" --entitlements "Entitlements.plist" "Payload/${appName}"

#Payload/Demo.app: replacing existing signature ：这个时候已经OK

#重签完毕

#压缩 -r:递归处理，将指定目录下的所有文件和子目录一并处理 -q:不显示处理过程

zip -rq "${outUpdateAppDir}/$channel.ipa" Payload

echo "........渠道${channel}打包已完成"

done

echo "------------------------程序打包已结束------------------------"
