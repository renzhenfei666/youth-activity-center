import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
	routes: [
		{
			path: '/',
			redirect: '/activityClassAndActualClass/activityClassMain'
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('@/views/login/login'),
			meta: {
			  title: '登录'
			},
		},
        {
            path: '/activityClassAndActualClass',
            name: 'activityClassAndActualClass',
			component: () => import('../components/common/Home'),
			children: [
				{
                    path: 'activityClassMain',
                    name: 'activityClassMain',
					component: () => import('../views/activityClassAndActualClass/activityClassMain'),
					meta: {
                        title: '学期管理',
                        // requireAuth: true
					}
				},
				{
                    path: 'activitySort',
                    name: 'activitySort',
					component: () => import('../views/activityClassAndActualClass/activitySort'),
					meta: {
                        title: '项目类别管理',
                        // requireAuth: true
					}
				},
				{
                    path: 'activity',
                    name: 'activity',
					component: () => import('../views/activityClassAndActualClass/activity'),
					meta: {
                        title: '项目管理',
                        // requireAuth: true
					}
				},
				{
                    path: 'activityClass',
                    name: 'activityClass',
					component: () => import('../views/activityClassAndActualClass/activityClass'),
					meta: {
                        title: '报名班级管理',
                        // requireAuth: true
					}
				}, 
				{
                    path: 'actualClass',
                    name: 'actualClass',
					component: () => import('../views/activityClassAndActualClass/actualClass'),
					meta: {
                        title: '上课班级管理',
                        // requireAuth: true
					}
                },
            ]
        }, 
        {
            path: '/activityEnroll',
            name: 'activityEnroll',
            component: () => import('../components/common/Home'),
            children: [
				{
                    path: 'enroll',
                    name: 'enroll',
                    component: () => import('../views/activityEnroll/enroll'),
                    meta: {
                        title: '报名汇总',
                        // requireAuth: true
                    }
                },
				{
                    path: 'activityEnrollandRetire',
                    name: 'activityEnrollandRetire',
                    component: () => import('../views/activityEnroll/activityEnrollandRetire'),
                    meta: {
                        title: '报名及退班',
                        // requireAuth: true
                    }
                },
				{
                    path: 'adjustment',
                    name: 'adjustment',
                    component: () => import('../views/activityEnroll/adjustment'),
                    meta: {
                        title: '插班及微调',
                        // requireAuth: true
                    }
                },
				{
                    path: 'classTransfer',
                    name: 'classTransfer',
                    component: () => import('../views/activityEnroll/classTransfer'),
                    meta: {
                        title: '调班申请',
                        // requireAuth: true
                    }
                },
				{
                    path: 'classDivideIntoClasses',
                    name: 'classDivideIntoClasses',
                    component: () => import('../views/activityEnroll/classDivideIntoClasses'),
                    meta: {
                        title: '调班分班',
                        // requireAuth: true
                    }
                }
            ],   
        },
        {
            path: '/costManagement',
            name: 'costManagement',
            component: () => import('../components/common/Home'),
            children: [
				{
                    path: 'paymentManagement',
                    name: 'paymentManagement',
                    component: () => import('../views/costManagement/paymentManagement'),
                    meta: {
                        title: '付款管理',
                        // requireAuth: true
                    }
                },
				{
                    path: 'refundManagement',
                    name: 'refundManagement',
                    component: () => import('../views/costManagement/refundManagement'),
                    meta: {
                        title: '退费管理(退班)',
                        // requireAuth: true
                    }
                },
				{
                    path: 'repairFeeManagement',
                    name: 'repairFeeManagement',
                    component: () => import('../views/costManagement/repairFeeManagement'),
                    meta: {
                        title: '补费管理(调班)',
                        // requireAuth: true
                    }
                },
				{
                    path: 'userOrderManagement',
                    name: 'userOrderManagement',
                    component: () => import('../views/costManagement/userOrderManagement'),
                    meta: {
                        title: '订单管理',
                        // requireAuth: true
                    }
                }
            ]
        },
        {
            path: '/printClassVouchers',
            name: 'printClassVouchers',
            component: () => import('../components/common/Home'),
            children: [
				{
                    path: 'printInfoWithEnroll',
                    name: 'printInfoWithEnroll',
                    component: () => import('../views/printClassVouchers/printInfoWithEnroll'),
                    meta: {
                        title: '按报名信息打印',
                        // requireAuth: true
                    }
                },
				{
                    path: 'printInfoWithActualClass',
                    name: 'printInfoWithActualClass',
                    component: () => import('../views/printClassVouchers/printInfoWithActualClass'),
                    meta: {
                        title: '按报名信息打印',
                        // requireAuth: true
                    }
                }
            ]
        },
        {
            path: '/rosterAndAttendance',
            name: 'rosterAndAttendance',
            component: () => import('../components/common/Home'),
            children: [
				{
                    path: 'rosterManagement',
                    name: 'rosterManagement',
                    component: () => import('../views/rosterAndAttendance/rosterManagement'),
                    meta: {
                        title: '花名册管理',
                        // requireAuth: true
                    }
                },
				{
                    path: 'attendanceManagement',
                    name: 'attendanceManagement',
                    component: () => import('../views/rosterAndAttendance/attendanceManagement'),
                    meta: {
                        title: '考勤管理',
                        // requireAuth: true
                    }
                }
            ]
        },
        {
            path: '/studentManagement',
            name: 'studentManagement',
            component: () => import('../components/common/Home'),
            children: [
				{
                    path: 'communityStudentManagement',
                    name: 'communityStudentManagement',
                    component: () => import('../views/studentManagement/communityStudentManagement'),
                    meta: {
                        title: '社会学生管理',
                        // requireAuth: true
                    }
                },
				{
                    path: 'allStudentManagement',
                    name: 'allStudentManagement',
                    component: () => import('../views/studentManagement/allStudentManagement'),
                    meta: {
                        title: '全部在册学生',
                        // requireAuth: true
                    }
                },
				{
                    path: 'nuptialStudentManagement',
                    name: 'nuptialStudentManagement',
                    component: () => import('../views/studentManagement/nuptialStudentManagement'),
                    meta: {
                        title: '重名学生管理',
                        // requireAuth: true
                    }
                }
            ]
        },
        {
            path: '/basicDataManagement',
            name: 'basicDataManagement',
            component: () => import('../components/common/Home'),
            children: [
				{
                    path: 'campusManagement',
                    name: 'campusManagement',
                    component: () => import('../views/basicDataManagement/campusManagement'),
                    meta: {
                        title: '校区管理',
                        // requireAuth: true
                    }
                },
				{
                    path: 'classInformationManagement',
                    name: 'classInformationManagement',
                    component: () => import('../views/basicDataManagement/classInformationManagement'),
                    meta: {
                        title: '上课信息管理',
                        // requireAuth: true
                    }
                },
				{
                    path: 'feeDerate',
                    name: 'feeDerate',
                    component: () => import('../views/basicDataManagement/feeDerate'),
                    meta: {
                        title: '费用减免',
                        // requireAuth: true
                    }
                }
            ]
        },
        {
            path: '/systemManagement',
            name: 'systemManagement',
            component: () => import('../components/common/Home'),
            children: [
				{
                    path: 'admin',
                    name: 'admin',
                    component: () => import('../views/systemManagement/admin'),
                    meta: {
                        title: '管理员管理',
                        // requireAuth: true
                    }
                },
				{
                    path: 'teacher',
                    name: 'teacher',
                    component: () => import('../views/systemManagement/teacher'),
                    meta: {
                        title: '任课教师管理',
                        // requireAuth: true
                    }
                },
				{
                    path: 'user',
                    name: 'user',
                    component: () => import('../views/systemManagement/user'),
                    meta: {
                        title: '家长用户管理',
                        // requireAuth: true
                    }
                },
				{
                    path: 'sms',
                    name: 'sms',
                    component: () => import('../views/systemManagement/sms'),
                    meta: {
                        title: '短信通知管理',
                        // requireAuth: true
                    }
                },
				{
                    path: 'functionalItem',
                    name: 'functionalItem',
                    component: () => import('../views/systemManagement/functionalItem'),
                    meta: {
                        title: '功能模块管理',
                        // requireAuth: true
                    }
                },
				{
                    path: 'role',
                    name: 'role',
                    component: () => import('../views/systemManagement/role'),
                    meta: {
                        title: '角色及权限管理',
                        // requireAuth: true
                    }
				},
          	]
		},
        {
			path: '*',
			redirect: '/404'
        }
	]
})

// 注册全局钩子用来拦截导航
// router.beforeEach((to, from, next) => {
//     const userId = sessionStorage.getItem('userId');
//     if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
//         if (userId) {
//             next()
//         } else {
//             next({
//                 path: "/login",
//                 query: {
//                     redirect: to.fullPath
//                 }
//             })
//         }
//     } else {
//         next()
//     }
// })

export default router