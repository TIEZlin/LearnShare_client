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

# 数据模型

