// 本地开发账号数据，用于模拟登录
export const localUsers = [
  {
    email: 'admin@local.dev',
    username: 'Admin',
    password: '123456',
    roleId: 1,
    userId: 10001,
    collegeId: 100,
    majorId: 200,
    avatarUrl: '',
    reputationScore: 90,
    status: 'active'
  },
  {
    email: 'student@local.dev',
    username: 'Student',
    password: '123456',
    roleId: 2,
    userId: 20001,
    collegeId: 100,
    majorId: 201,
    avatarUrl: '',
    reputationScore: 60,
    status: 'active'
  },
  {
    email: 'demo@local.dev',
    username: 'Demo User',
    password: '123456',
    roleId: 2,
    userId: 20002,
    collegeId: 100,
    majorId: 202,
    avatarUrl: '',
    reputationScore: 70,
    status: 'active'
  },
  {
    email: 'test@local.dev',
    username: 'Test User',
    password: '123456',
    roleId: 2,
    userId: 20003,
    collegeId: 100,
    majorId: 203,
    avatarUrl: '',
    reputationScore: 65,
    status: 'active'
  }
]

export function findLocalUserByIdentity(identity) {
  const idLower = String(identity || '').toLowerCase()
  return localUsers.find(
    (u) => u.email.toLowerCase() === idLower || u.username.toLowerCase() === idLower
  )
}
