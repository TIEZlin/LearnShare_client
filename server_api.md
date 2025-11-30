---
title: 默认模块
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# 默认模块

Base URLs:

# Authentication

# 认证

## POST 用户注册

POST /api/auth/register

新用户注册，需提供用户名、密码和邮箱进行绑定。

> Body 请求参数

```yaml
username: Zjchao
password: 123456zjc
email: zjc@fzu.com

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» username|body|string| 是 |用户名|
|» password|body|string| 是 |密码|
|» email|body|string| 是 |邮箱|

> 返回示例

> 200 Response

```json
{
  "baseResponse": {
    "code": 0,
    "message": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|注册成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|输入格式或唯一性校验失败|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResponse|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» base|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

## POST 用户登录

POST /api/auth/login

通过邮箱、密码进行登录。登录失败次数限制为5次/15分钟。

> Body 请求参数

```yaml
email: zjc@fzu.com
password: 123456zjc

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» email|body|string| 是 |账号|
|» password|body|string| 是 |密码|

> 返回示例

> 200 Response

```json
{
  "baseResponse": {
    "code": 0,
    "message": "string"
  },
  "user": {
    "userId": 0,
    "username": "string",
    "email": "string",
    "college_id": 0,
    "major_id": 0,
    "avatar_url": "string",
    "reputation_score": 0,
    "roleId": 0,
    "status": "string",
    "created_at": 0,
    "updated_at": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|登录成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|用户名或密码错误/账户锁定|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResponse|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|
|» user|object|true|none||none|
|»» userId|integer|true|none||none|
|»» username|string|true|none||none|
|»» email|string|true|none||none|
|»» college_id|integer|true|none||none|
|»» major_id|integer|true|none||none|
|»» avatar_url|string|true|none||none|
|»» reputation_score|integer|true|none||none|
|»» roleId|integer|true|none||none|
|»» status|string|true|none||none|
|»» created_at|integer|true|none||none|
|»» updated_at|integer|true|none||none|

### 返回头部 Header

|Status|Header|Type|Format|Description|
|---|---|---|---|---|
|200|Access-Token|string||访问令牌|
|200|Refresh-Token|string||刷新令牌|

## POST 验证邮箱

POST /api/users/me/email/verify

> Body 请求参数

```yaml
email: 2451965602@qq.com
code: "879301"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» email|body|string| 是 |邮箱地址|
|» code|body|string| 是 |验证码|

> 返回示例

> 200 Response

```json
{
  "baseResponse": {
    "code": 0,
    "message": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResponse|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» base|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

## POST 用户登出

POST /api/auth/logout

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 更新AccessToken

POST /api/auth/refresh

> Body 请求参数

```yaml
{}

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Refresh-Token|header|string| 是 |刷新令牌|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{
  "baseResponse": {
    "code": 0,
    "message": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResponse|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

### 返回头部 Header

|Status|Header|Type|Format|Description|
|---|---|---|---|---|
|200|Access-Token|string||新的访问令牌|

## POST 获取邮箱验证码

POST /api/users/me/email/get

> Body 请求参数

```yaml
email: 2451965602@qq.com

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» email|body|string| 是 |邮箱|

> 返回示例

> 200 Response

```json
{
  "baseResponse": {
    "code": 0,
    "message": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResponse|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

## POST 重置密码

POST /api/users/me/password/reset

> Body 请求参数

```yaml
email: 2451965602@qq.com
code: "546255"
new_password: lbl102300218

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» email|body|string| 是 |邮箱|
|» code|body|string| 是 |验证码|
|» new_password|body|string| 是 |新密码|

> 返回示例

> 200 Response

```json
{
  "baseResponse": {
    "code": 0,
    "message": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResponse|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

# 用户

## GET 获取用户基本信息

GET /api/users/{user_id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|user_id|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "baseResponse": {
    "code": 0,
    "message": "string"
  },
  "user": {
    "userId": 0,
    "username": "string",
    "email": "string",
    "college_id": 0,
    "major_id": 0,
    "avatar_url": "string",
    "reputation_score": 0,
    "roleId": 0,
    "status": "string",
    "created_at": 0,
    "updated_at": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功获取用户资料|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResponse|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|
|» user|object|true|none||none|
|»» userId|integer|true|none||none|
|»» username|string|true|none||none|
|»» email|string|true|none||none|
|»» college_id|integer|true|none||none|
|»» major_id|integer|true|none||none|
|»» avatar_url|string|true|none||none|
|»» reputation_score|integer|true|none||none|
|»» roleId|integer|true|none||none|
|»» status|string|true|none||none|
|»» created_at|integer|true|none||none|
|»» updated_at|integer|true|none||none|

## PUT 修改邮箱

PUT /api/users/me/email

> Body 请求参数

```yaml
new_email: ""
code: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 是 |none|
|body|body|object| 否 |none|
|» new_email|body|string| 是 |新的邮箱|
|» code|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## PUT 修改密码

PUT /api/users/me/password

> Body 请求参数

```yaml
old_password: ""
new_password: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 是 |none|
|body|body|object| 否 |none|
|» old_password|body|string| 是 |旧密码|
|» new_password|body|string| 是 |新密码|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|none|Inline|

### 返回数据结构

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResponse|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

## PUT 修改专业

PUT /api/users/me/major

> Body 请求参数

```yaml
new_majorId: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 是 |none|
|body|body|object| 否 |none|
|» new_majorId|body|string| 是 |新的专业|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## PUT 设置头像

PUT /api/users/avatar

> Body 请求参数

```yaml
avatar: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 是 |none|
|body|body|object| 否 |none|
|» avatar|body|string(binary)| 是 |avatar 是文件流|

> 返回示例

> 200 Response

```json
{
  "baseResponse": {
    "code": 0,
    "message": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResponse|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

# 收藏

## GET 我的收藏

GET /api/users/me/favorites

获取用户收藏的课程、教师或资源列表。

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|type|query|string| 是 |类型(resource, course)|
|Authorization|header|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功获取收藏列表|Inline|

### 返回数据结构

## POST 添加收藏

POST /api/users/me/favorites

收藏一个课程、教师或资源。

> Body 请求参数

```yaml
target_type: ""
target_id: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 是 |none|
|body|body|object| 否 |none|
|» target_type|body|string| 是 |类型(resource, course)|
|» target_id|body|string| 是 |ID 编号|

> 返回示例

> 201 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|收藏成功|Inline|

### 返回数据结构

## DELETE 取消收藏

DELETE /api/users/me/favorites

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|favorite_id|query|string| 是 |ID 编号|
|Authorization|header|string| 是 |none|

> 返回示例

> 204 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|取消收藏成功|Inline|

### 返回数据结构

# 学校结构

## GET 获取学院列表

GET /api/school/college/list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page_size|query|number| 是 |none|
|page_num|query|number| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取专业列表

GET /api/school/major/list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page_size|query|number| 是 |页面大小|
|page_num|query|number| 是 |页码|
|college_id|query|integer| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取教师信息

GET /api/school/teacher/list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|teacherId|query|integer| 是 |none|
|college_id|query|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理员/学校结构

## POST 添加学院

POST /api/admin/colleges

> Body 请求参数

```yaml
college_name: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 是 |none|
|body|body|object| 否 |none|
|» college_name|body|string| 是 |学院名|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 添加专业

POST /api/admin/majors

> Body 请求参数

```yaml
major_name: ""
college_id: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 是 |none|
|body|body|object| 否 |none|
|» major_name|body|string| 是 |专业名|
|» college_id|body|string| 是 |学院ID|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 添加教师

POST /api/admin/teachers

> Body 请求参数

```yaml
teacher_name: ""
college_id: ""
introduction: ""
email: ""
avatar: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 是 |none|
|body|body|object| 是 |none|
|» teacher_name|body|string| 是 |none|
|» college_id|body|string| 是 |none|
|» introduction|body|string| 是 |none|
|» email|body|string| 是 |none|
|» avatar|body|string(binary)| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理员/用户

## POST 添加用户

POST /api/admin/users

> Body 请求参数

```yaml
username: ""
password: ""
email: ""
role_id: ""
status: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 是 |none|
|body|body|object| 否 |none|
|» username|body|string| 是 |账号|
|» password|body|string| 是 |密码|
|» email|body|string| 是 |邮箱|
|» role_id|body|string| 是 |角色id|
|» status|body|string| 是 |用户状态|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## PUT 修改用户

PUT /api/admin/users

> Body 请求参数

```yaml
username: ""
password: ""
email: ""
college_id: ""
major_id: ""
avatar_url: ""
reputation_score: ""
role_id: ""
status: ""
user_id: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 是 |none|
|body|body|object| 否 |none|
|» username|body|string| 否 |账号|
|» password|body|string| 否 |密码|
|» email|body|string| 否 |邮箱|
|» college_id|body|string| 否 |学院id|
|» major_id|body|string| 否 |专业id|
|» avatar_url|body|string(binary)| 否 |头像|
|» reputation_score|body|string| 否 |信誉分|
|» role_id|body|string| 否 |角色id|
|» status|body|string| 否 |账号状态|
|» user_id|body|string| 是 |用户id|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理员/审核

## GET 获取待审核资源列表

GET /api/admin/audit/resources

获取所有被系统自动标记或被用户举报的待审核资源。仅限管理员访问。

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page_size|query|integer| 是 |页面大小|
|page_num|query|integer| 是 |页码|
|Authorization|header|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "base_resp": {
    "code": 0,
    "message": "string"
  },
  "resource_review_list": [
    {
      "reviewId": 0,
      "reviewerId": 0,
      "reporterId": 0,
      "targetId": 0,
      "targetType": "string",
      "reason": "string",
      "status": "string",
      "priority": 0,
      "createdAt": 0
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功获取待审核资源列表|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» base_resp|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|
|» resource_review_list|[object]|true|none||none|
|»» reviewId|integer|true|none||none|
|»» reviewerId|integer|true|none||none|
|»» reporterId|integer|true|none||none|
|»» targetId|integer|true|none||none|
|»» targetType|string|true|none||none|
|»» reason|string|true|none||none|
|»» status|string|true|none||none|
|»» priority|integer|true|none||none|
|»» createdAt|integer|true|none||none|

## POST 处理资源审核请求

POST /api/admin/audit/resources/{review_id}

管理员对资源进行通过、驳回（隐藏）或删除操作。

> Body 请求参数

```yaml
action: approve

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|review_id|path|string| 是 |none|
|Authorization|header|string| 是 |none|
|body|body|object| 否 |none|
|» action|body|string| 是 |状态——是否通过"approve" or "reject"|

#### 枚举值

|属性|值|
|---|---|
|» action|approve|
|» action|reject|

> 返回示例

> 200 Response

```json
{
  "base_resp": {
    "code": 0,
    "message": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|操作成功|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» base_resp|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

## GET 获取待审核课程列表

GET /api/admin/audit/courses

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page_size|query|integer| 是 |页面大小|
|page_num|query|integer| 是 |页码|
|Authorization|header|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 处理待审核课程请求

POST /api/admin/audit/courses/{review_id}

> Body 请求参数

```yaml
action: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|review_id|path|string| 是 |none|
|Authorization|header|string| 是 |none|
|body|body|object| 否 |none|
|» action|body|string| 是 |状态——是否通过"approve" or "reject"|

#### 枚举值

|属性|值|
|---|---|
|» action|approve|
|» action|reject|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取待审核课程评论列表

GET /api/admin/audit/course_comments

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page_size|query|integer| 是 |页面大小|
|page_num|query|integer| 是 |页码|
|Authorization|header|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 处理课程评论审核请求

POST /api/admin/audit/course_comments/{review_id}

> Body 请求参数

```yaml
action: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|review_id|path|string| 是 |none|
|Authorization|header|string| 是 |none|
|body|body|object| 否 |none|
|» action|body|string| 是 |状态——是否通过"approve" or "reject"|

#### 枚举值

|属性|值|
|---|---|
|» action|approve|
|» action|reject|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取待审核资源评论列表

GET /api/admin/audit/resource_comments

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page_size|query|integer| 是 |none|
|page_num|query|integer| 是 |none|
|Authorization|header|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "base_resp": {
    "code": 0,
    "message": "string"
  },
  "comment_audit_list": [
    {
      "reviewId": 0,
      "reviewerId": 0,
      "reporterId": 0,
      "targetId": 0,
      "targetType": "string",
      "reason": "string",
      "status": "string",
      "priority": 0,
      "createdAt": 0
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» base_resp|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|
|» comment_audit_list|[object]|true|none||none|
|»» reviewId|integer|true|none||none|
|»» reviewerId|integer|true|none||none|
|»» reporterId|integer|true|none||none|
|»» targetId|integer|true|none||none|
|»» targetType|string|true|none||none|
|»» reason|string|true|none||none|
|»» status|string|true|none||none|
|»» priority|integer|true|none||none|
|»» createdAt|integer|true|none||none|

## POST 处理资源评论审核请求

POST /api/admin/audit/resource_comments/{review_id}

> Body 请求参数

```yaml
action: approve

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|review_id|path|string| 是 |none|
|Authorization|header|string| 是 |none|
|body|body|object| 是 |none|
|» action|body|string| 是 |none|

#### 枚举值

|属性|值|
|---|---|
|» action|approve|
|» action|reject|

> 返回示例

> 200 Response

```json
{
  "base_resp": {
    "code": 0,
    "message": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» base_resp|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

# 管理员/权限与角色

## GET 获取权限列表

GET /api/admin/permissions

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page_size|query|integer| 是 |页面大小|
|page_num|query|integer| 是 |页码|
|Authorization|header|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取角色列表

GET /api/admin/roles

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page_size|query|integer| 是 |页面大小|
|page_num|query|integer| 是 |页码|
|Authorization|header|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 新建角色

POST /api/admin/roles

> Body 请求参数

```yaml
name: ""
permission:
  - ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 是 |none|
|body|body|object| 否 |none|
|» name|body|string| 是 |角色名|
|» permission|body|[string]| 是 |对应权限ID|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理员/课程

## DELETE  删除课程

DELETE /api/admin/courses/{course_id}

管理员删除课程（记录原因）

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|course_id|path|string| 是 |none|
|Authorization|header|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理员/资源

## DELETE  删除资源

DELETE /api/admin/resources/{resource_id}

管理员删除单个资源（记录原因）

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|resource_id|path|string| 是 |none|
|Authorization|header|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "base_resp": {
    "code": 0,
    "message": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» base_resp|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

# 管理员/评论与评分

## DELETE 删除资源评价

DELETE /api/admin/resource_comments/{comment_id}

管理员删除资源评价并记录原因

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|comment_id|path|string| 是 |none|
|Authorization|header|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "base_resp": {
    "code": 0,
    "message": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» base_resp|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

## DELETE  删除课程评价

DELETE /api/admin/course_comments/{commrnt_id}

管理员删除课程评价并记录原因

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|commrnt_id|path|string| 是 |none|
|Authorization|header|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## DELETE 删除资源评分

DELETE /api/admin/resource_ratings/{rating_id}

管理员删除资源评分并记录原因

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|rating_id|path|string| 是 |none|
|Authorization|header|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "base_resp": {
    "code": 0,
    "message": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» base_resp|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

## DELETE 删除课程评分

DELETE /api/admin/course_ratings/{rating_id}

管理员删除资源评分并记录原因

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|rating_id|path|string| 是 |none|
|Authorization|header|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 管理员/商城

## POST 创建商品

POST /api/admin/shop/products

创建商品

> Body 请求参数

```yaml
name: 教材名称
description: 商品描述
price: 50
category: books
stock: 100
status: active
images:
  - ""
specifications: "{}"
type: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 是 |none|
|body|body|object| 否 |none|
|» name|body|string| 否 |商品名称|
|» description|body|string| 否 |商品描述|
|» price|body|number| 否 |商品价格|
|» category|body|string| 否 |商品分类（书籍，头像框，勋章）|
|» stock|body|number| 否 |库存数量|
|» status|body|string| 否 |商品状态|
|» images|body|array| 否 |商品图片|
|» specifications|body|string| 否 |商品规格|
|» type|body|string| 否 |商品类别(虚拟，实物)|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## DELETE 批量删除商品

DELETE /api/admin/shop/products

批量操作商品

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|array[string]| 是 |商品ID|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## DELETE 删除商品分类

DELETE /api/admin/shop/categories

删除商品分类

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|query|number| 否 |分类ID|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## PUT 更新商品库存

PUT /api/admin/shop/inventory/{id}

更新库存

> Body 请求参数

```yaml
id: 1
stock: 100
operation: set
reason: 补货

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|string| 是 |none|
|body|body|object| 否 |none|
|» id|body|number| 否 |商品ID|
|» stock|body|number| 否 |库存数量|
|» operation|body|string| 否 |库存操作|
|» reason|body|string| 否 |操作原因|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 课程

## GET 搜索课程

GET /api/courses/search

获取课程列表，支持按学院、专业、年级、学分、评分等进行筛选和搜索。

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|keywords|query|string| 否 |搜索关键词（课程名或教师名）|
|collegeId|query|integer| 否 |学院ID|
|grade|query|string| 否 |年级|
|minRating|query|number(float)| 否 |最小综合评分|
|page_size|query|integer| 是 |页面大小|
|page_num|query|integer| 是 |页码|

> 返回示例

> 200 Response

```json
{
  "baseResponse": {
    "code": 0,
    "message": "string"
  },
  "courses": [
    {
      "courseId": 0,
      "courseName": "string",
      "teacherId": 0,
      "credit": 0,
      "majorId": 0,
      "grade": "string",
      "description": "string",
      "createdAt": 0,
      "updatedAt": 0
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功获取课程列表|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResponse|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|
|» courses|[object]|true|none||none|
|»» courseId|integer|true|none||none|
|»» courseName|string|true|none||none|
|»» teacherId|integer|true|none||none|
|»» credit|integer|true|none||none|
|»» majorId|integer|true|none||none|
|»» grade|string|true|none||none|
|»» description|string|true|none||none|
|»» createdAt|integer|true|none||none|
|»» updatedAt|integer|true|none||none|

## GET 获取课程详情

GET /api/courses/{course_id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|course_id|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "baseResponse": {
    "code": 0,
    "message": "string"
  },
  "course": {
    "courseId": 0,
    "courseName": "string",
    "teacherId": 0,
    "credit": 0,
    "majorId": 0,
    "grade": "string",
    "description": "string",
    "createdAt": 0,
    "updatedAt": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功获取课程详情|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|课程不存在|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResponse|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|
|» course|object|true|none||none|
|»» courseId|integer|true|none||none|
|»» courseName|string|true|none||none|
|»» teacherId|integer|true|none||none|
|»» credit|integer|true|none||none|
|»» majorId|integer|true|none||none|
|»» grade|string|true|none||none|
|»» description|string|true|none||none|
|»» createdAt|integer|true|none||none|
|»» updatedAt|integer|true|none||none|

## GET 获取课程资源列表

GET /api/courses/{course_id}/resources

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|course_id|path|string| 是 |none|
|page_num|query|number| 是 |页码|
|page_size|query|number| 是 |每页数量|
|type|query|string| 否 |资源类型|
|status|query|string| 否 |资源状态|

> 返回示例

> 200 Response

```json
{
  "baseResponse": {
    "code": 0,
    "message": "string"
  },
  "resources": [
    {
      "resourceId": 0,
      "title": "string",
      "description": "string",
      "filePath": "string",
      "fileType": "string",
      "fileSize": 0,
      "uploaderId": 0,
      "courseId": 0,
      "downloadCount": 0,
      "averageRating": 0,
      "ratingCount": 0,
      "status": 0,
      "createdAt": 0
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResponse|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|
|» resources|[object]|true|none||none|
|»» resourceId|integer|false|none||none|
|»» title|string|false|none||none|
|»» description|string|false|none||none|
|»» filePath|string|false|none||none|
|»» fileType|string|false|none||none|
|»» fileSize|integer|false|none||none|
|»» uploaderId|integer|false|none||none|
|»» courseId|integer|false|none||none|
|»» downloadCount|integer|false|none||none|
|»» averageRating|integer|false|none||none|
|»» ratingCount|integer|false|none||none|
|»» status|integer|false|none||none|
|»» createdAt|integer|false|none||none|

# 资源

## GET 搜索资源

GET /api/resources/search

获取资源列表，支持按标签、课程、下载量/评分排序。

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|keyword|query|string| 否 |搜索关键词|
|tagId|query|integer| 否 |标签ID|
|sortBy|query|string| 否 |排序方式：latest (最新), hot (下载量), rating (评分)|
|course_id|query|string| 否 |课程ID|
|page_size|query|integer| 是 |页面大小|
|page_num|query|integer| 是 |页码|

#### 枚举值

|属性|值|
|---|---|
|sortBy|latest|
|sortBy|hot|
|sortBy|rating|

> 返回示例

> 200 Response

```json
{
  "baseResp": {
    "code": 0,
    "message": "string"
  },
  "resources": [
    {
      "resourceId": 0,
      "title": "string",
      "description": "string",
      "filePath": "string",
      "fileType": "string",
      "fileSize": 0,
      "uploaderId": 0,
      "courseId": 0,
      "downloadCount": 0,
      "averageRating": 0,
      "ratingCount": 0,
      "status": 0,
      "createdAt": 0,
      "tags": [
        {
          "tagId": 0,
          "tagName": "string"
        }
      ]
    }
  ],
  "total": 0
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功获取资源列表|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResp|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|
|» resources|[object]|true|none||none|
|»» resourceId|integer|false|none||none|
|»» title|string|false|none||none|
|»» description|string|false|none||none|
|»» filePath|string|false|none||none|
|»» fileType|string|false|none||none|
|»» fileSize|integer|false|none||none|
|»» uploaderId|integer|false|none||none|
|»» courseId|integer|false|none||none|
|»» downloadCount|integer|false|none||none|
|»» averageRating|number|false|none||none|
|»» ratingCount|integer|false|none||none|
|»» status|integer|false|none||none|
|»» createdAt|integer|false|none||none|
|»» tags|[object]|false|none||none|
|»»» tagId|integer|true|none||none|
|»»» tagName|string|true|none||none|
|» total|integer|true|none||none|

## POST 上传课程资源

POST /api/resources

用户上传课程资源文件。仅支持 .pdf, .docx, .pptx, .zip，最大3MB。上传后资源进入待审核或直接发布。

> Body 请求参数

```yaml
file: file://C:\Users\zjc\Desktop\test.pptx
title: pptx
description: ""
course_id: 1
tags:
  - 复习资料

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 是 |none|
|body|body|object| 否 |none|
|» file|body|string(binary)| 是 |资源文件 (最大3MB)|
|» title|body|string| 是 |资源标题|
|» description|body|string| 否 |资源简介 (可选)|
|» course_id|body|integer| 是 |关联课程ID|
|» tags|body|[string]| 否 |资源标签 (例如: 期末复习资料)|

> 返回示例

> 201 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|上传成功，资源已直接发布|Inline|
|202|[Accepted](https://tools.ietf.org/html/rfc7231#section-6.3.3)|上传成功，资源进入审核流程|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|文件类型/大小不符合要求|Inline|

### 返回数据结构

## GET 下载课程资源

GET /api/resources/{resource_id}/download

记录下载日志，增加上传者信誉分，并返回资源下载链接。

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|resource_id|path|string| 是 |none|
|Authorization|header|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "baseResp": {
    "code": 0,
    "message": "string"
  },
  "downloadUrl": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|下载成功，返回资源链接|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResp|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|
|» downloadUrl|string|true|none||none|

## POST 举报资源

POST /api/resources/{resource_id}/report

用户举报违规、低质量或侵权的资源。

> Body 请求参数

```yaml
reason: 涉黄

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|resource_id|path|string| 是 |none|
|Authorization|header|string| 是 |none|
|body|body|object| 否 |none|
|» reason|body|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "baseResp": {
    "code": 0,
    "message": "string"
  }
}
```

> 404 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|举报提交成功，进入审核队列|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResp|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

## GET 获取资源信息

GET /api/resources/{resource_id}

获取单个资源的基本信息，如描述，上传者等

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|resource_id|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "baseResp": {
    "code": 0,
    "message": "string"
  },
  "resource": {
    "resourceId": 0,
    "title": "string",
    "description": "string",
    "filePath": "string",
    "fileType": "string",
    "fileSize": 0,
    "uploaderId": 0,
    "courseId": 0,
    "downloadCount": 0,
    "averageRating": 0,
    "ratingCount": 0,
    "status": 0,
    "createdAt": 0,
    "tags": [
      {
        "tagId": 0,
        "tagName": "string"
      }
    ]
  }
}
```

> 404 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResp|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|
|» resource|object|true|none||none|
|»» resourceId|integer|true|none||none|
|»» title|string|true|none||none|
|»» description|string|true|none||none|
|»» filePath|string|true|none||none|
|»» fileType|string|true|none||none|
|»» fileSize|integer|true|none||none|
|»» uploaderId|integer|true|none||none|
|»» courseId|integer|true|none||none|
|»» downloadCount|integer|true|none||none|
|»» averageRating|number|true|none||none|
|»» ratingCount|integer|true|none||none|
|»» status|integer|true|none||none|
|»» createdAt|integer|true|none||none|
|»» tags|[object]|true|none||none|
|»»» tagId|integer|true|none||none|
|»»» tagName|string|true|none||none|

# 评分与评论

## GET 获取课程评论列表

GET /api/courses/{course_id}/comments

获取某课程下的所有评论，支持按最新/最热排序。

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|course_id|path|string| 是 |none|
|sortBy|query|string| 否 |排序方式：latest (最新), hot (最热/点赞数)|
|page_size|query|string| 是 |页面大小|
|page_num|query|string| 是 |页码|

#### 枚举值

|属性|值|
|---|---|
|sortBy|latest|
|sortBy|hot|

> 返回示例

> 200 Response

```json
{
  "baseResponse": {
    "code": 0,
    "message": "string"
  },
  "comments": [
    {
      "commentId": 0,
      "user": {
        "userId": 0,
        "username": "string",
        "email": "string",
        "college_id": 0,
        "major_id": 0,
        "avatar_url": "string",
        "reputation_score": 0,
        "roleId": 0,
        "status": "string",
        "created_at": 0,
        "updated_at": 0
      },
      "courseId": 0,
      "content": "string",
      "parentId": 0,
      "likes": 0,
      "isVisible": true,
      "status": 0,
      "createdAt": 0
    }
  ]
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功获取评论列表|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResponse|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|
|» comments|[object]|true|none||none|
|»» commentId|integer|true|none||none|
|»» user|object|true|none||none|
|»»» userId|integer|true|none||none|
|»»» username|string|true|none||none|
|»»» email|string|true|none||none|
|»»» college_id|integer|true|none||none|
|»»» major_id|integer|true|none||none|
|»»» avatar_url|string|true|none||none|
|»»» reputation_score|integer|true|none||none|
|»»» roleId|integer|true|none||none|
|»»» status|string|true|none||none|
|»»» created_at|integer|true|none||none|
|»»» updated_at|integer|true|none||none|
|»» courseId|integer|true|none||none|
|»» content|string|true|none||none|
|»» parentId|integer|true|none||none|
|»» likes|integer|true|none||none|
|»» isVisible|boolean|true|none||none|
|»» status|integer|true|none||none|
|»» createdAt|integer|true|none||none|

## POST 提交课程评分

POST /api/course_ratings/{course_id}

对老师教授的某门课程进行综合推荐度、难度、考核压力、实用性等评分

> Body 请求参数

```yaml
rating: 1.5

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|course_id|path|string| 是 |none|
|body|body|object| 否 |none|
|» rating|body|number| 是 |none|

> 返回示例

> 200 Response

```json
{
  "baseResponse": {
    "code": 0,
    "message": "string"
  },
  "rating": {
    "ratingId": 0,
    "userId": 0,
    "courseId": 0,
    "recommendation": 0,
    "difficulty": "string",
    "workload": 0,
    "usefulness": 0,
    "isVisible": true,
    "createdAt": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResponse|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|
|» rating|object|true|none||none|
|»» ratingId|integer|true|none||none|
|»» userId|integer|true|none||none|
|»» courseId|integer|true|none||none|
|»» recommendation|integer|true|none||none|
|»» difficulty|string|true|none||none|
|»» workload|integer|true|none||none|
|»» usefulness|integer|true|none||none|
|»» isVisible|boolean|true|none||none|
|»» createdAt|integer|true|none||none|

## POST 提交课程评论

POST /api/course_comments/{course_id}

对老师教授的某门课程进行综合推荐度、难度、考核压力、实用性评论。

> Body 请求参数

```yaml
contents: ""
parent_id: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|course_id|path|string| 是 |none|
|Authorization|header|string| 是 |none|
|body|body|object| 否 |none|
|» contents|body|string| 是 |none|
|» parent_id|body|string| 否 |被回复的评论 ID，缺省表示发顶层评论|

> 返回示例

> 200 Response

```json
{
  "baseResponse": {
    "code": 0,
    "message": "string"
  },
  "comment": {
    "commentId": 0,
    "userId": 0,
    "courseId": 0,
    "content": "string",
    "parentId": 0,
    "likes": 0,
    "isVisible": true,
    "status": 0,
    "createdAt": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|评分/评论提交成功|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResponse|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|
|» comment|object|true|none||none|
|»» commentId|integer|true|none||none|
|»» userId|integer|true|none||none|
|»» courseId|integer|true|none||none|
|»» content|string|true|none||none|
|»» parentId|integer|true|none||none|
|»» likes|integer|true|none||none|
|»» isVisible|boolean|true|none||none|
|»» status|integer|true|none||none|
|»» createdAt|integer|true|none||none|

## DELETE 删除课程评价

DELETE /api/courses_comments/{comment_id}

用户删除自己所撰写的课程评价

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|comment_id|path|string| 是 |none|
|Authorization|header|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "baseResponse": {
    "code": 0,
    "message": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResponse|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

## DELETE 删除课程评分

DELETE /api/course_ratings/{rating_id}

用户删除自己所撰写的课程评分

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|rating_id|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "baseResponse": {
    "code": 0,
    "message": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResponse|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

## POST 课程评论点赞/点踩/取消点赞/取消点踩

POST /api/course_comments/{comment_id}/likes

> Body 请求参数

```json
{
  "action": "like"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|comment_id|path|string| 是 |none|
|Authorization|header|string| 是 |none|
|body|body|object| 是 |none|
|» action|body|string| 是 |none|

#### 枚举值

|属性|值|
|---|---|
|» action|like|
|» action|dislike|
|» action|cancel_like|
|» action|cancel_dislike|

> 返回示例

> 200 Response

```json
{
  "baseResp": {}
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResp|object|true|none||none|

## GET 获取资源评论列表

GET /api/resource/{resource_id}/comment

获取某课程下的资源评论，并按最新最热排序

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|resource_id|path|string| 是 |none|
|page_size|query|string| 是 |页面大小|
|page_num|query|string| 是 |页码|

> 返回示例

> 200 Response

```json
{
  "baseResp": {
    "code": 0,
    "message": "string"
  },
  "comments": [
    {
      "commentId": 0,
      "userId": 0,
      "resourceId": 0,
      "content": "string",
      "parentId": 0,
      "likes": 0,
      "isVisible": true,
      "status": 0,
      "createdAt": 0
    }
  ],
  "total": 0
}
```

> 404 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResp|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|
|» comments|[object]|true|none||none|
|»» commentId|integer|false|none||none|
|»» userId|integer|false|none||none|
|»» resourceId|integer|false|none||none|
|»» content|string|false|none||none|
|»» parentId|integer|false|none||none|
|»» likes|integer|false|none||none|
|»» isVisible|boolean|false|none||none|
|»» status|integer|false|none||none|
|»» createdAt|integer|false|none||none|
|» total|integer|true|none||none|

## POST 提交资源评分

POST /api/resource_ratings/{resource_id}

对其他用户上传的资源进行综合推荐度评分。

> Body 请求参数

```yaml
rating: 1.5

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|resource_id|path|string| 是 |none|
|Authorization|header|string| 是 |none|
|body|body|object| 否 |none|
|» rating|body|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "baseResp": {
    "code": 0,
    "message": "string"
  }
}
```

> 404 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|评分提交成功|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResp|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

## POST 提交资源评价

POST /api/resource_comments/{resource_id}

用户根据资源本身提交对资源的评价

> Body 请求参数

```yaml
content: test
parent_id: "1"

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|resource_id|path|string| 是 |none|
|Authorization|header|string| 是 |none|
|body|body|object| 否 |none|
|» content|body|string| 是 |none|
|» parent_id|body|string| 否 |被回复的评论 ID，缺省表示发顶层评论|

> 返回示例

> 200 Response

```json
{
  "baseResp": {
    "code": 10000,
    "message": "成功"
  }
}
```

> 404 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResp|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

## DELETE 删除资源评分

DELETE /api/resource_ratings/{rating_id}

用户删除自己给资源评分并给出新的评分。

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|rating_id|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "baseResp": {
    "code": 0,
    "message": "string"
  }
}
```

> 404 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResp|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

## DELETE 删除资源评价

DELETE /api/resource_comments/{comment_id}

删除资源评价

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|comment_id|path|string| 是 |none|
|id|query|number| 否 |资源ID|
|reviewId|query|number| 否 |评价ID|
|Authorization|header|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "baseResp": {
    "code": 0,
    "message": "string"
  }
}
```

> 404 Response

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResp|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

## POST 资源评论点赞/点踩/取消点赞/取消点踩

POST /api/resource_comments/{comment_id}/likes

> Body 请求参数

```json
{
  "action": "like"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|comment_id|path|string| 是 |none|
|Authorization|header|string| 是 |none|
|body|body|object| 是 |none|
|» action|body|string| 是 |操作类型|

#### 枚举值

|属性|值|
|---|---|
|» action|like|
|» action|dislike|
|» action|cancel_like|
|» action|cancel_dislike|

> 返回示例

> 200 Response

```json
{
  "baseResp": {
    "code": 0,
    "message": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|操作成功|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» baseResp|object|true|none||none|
|»» code|integer|true|none||none|
|»» message|string|true|none||none|

# 积分商城

## GET 获取商品详情

GET /api/items/{item_id}

获取商品管理详情,如商品种类和描述。

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|item_id|path|string| 是 |none|
|page_num|query|number| 否 |页码|
|page_size|query|number| 否 |每页数量|
|type|query|string| 否 |商品分类|
|description|query|string| 否 |商品状态|
|keyword|query|string| 否 |搜索关键词|
|price|query|number| 否 |价格|
|image_url|query|number| 否 |图片|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取商品列表

GET /api/items

获取商品管理列表

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 积分商城/激励措施

## POST 兑换积分商品

POST /api/points/products/{id}/exchange

兑换积分商品

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|string| 是 |none|
|quantity|query|number| 否 |兑换数量|
|address|query|string| 否 |收货地址|
|note|query|string| 否 |兑换备注|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取积分订单列表

GET /api/points/orders

获取积分订单列表

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|number| 否 |页码|
|limit|query|number| 否 |每页数量|
|status|query|string| 否 |订单状态|
|dateFrom|query|string| 否 |开始日期|
|dateTo|query|string| 否 |结束日期|
|sortBy|query|string| 否 |排序字段|
|sortOrder|query|string| 否 |排序方向|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 取消积分订单

POST /api/points/orders/{id}/cancel

取消积分订单

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|string| 是 |none|
|reason|query|string| 否 |取消原因|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST /points/earn

POST /api/points/earn

/points/earn

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|period|query|string| 否 |统计周期|
|limit|query|number| 否 |排行榜数量|
|college|query|string| 否 |学院筛选|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取积分统计

GET /api/points/statistics

获取积分统计

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|period|query|string| 否 |统计周期|
|startDate|query|string| 否 |开始日期|
|endDate|query|string| 否 |结束日期|
|type|query|string| 否 |统计类型|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取商城可兑换物品列表

GET /api/store/items

获取头像框、勋章等虚拟物品列表，显示所需积分。

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功获取物品列表|Inline|

### 返回数据结构

# 数据模型

