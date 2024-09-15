const routes = {
    user: {
        auth: {
            path: '/account/auth',
            type: 'POST',
            params: [],
            body: ['username' , 'password']
        },
        create: {
            path: '/account/signup',
            type: 'POST',
            params: [],
            body: [ 'first_name', 'last_name', 'email', 'username', 'password', 'color', 'organization_id']
        },
        update: {
            path: '/user/update',
            type: 'PUT',
            params: [id],
            body: []
        },
        delete: {
            path: '/user/delete',
            type: 'DELETE',
            params: ['id'],
            body: []
        }
    },
    project: {
        create: {
            path: '/project/create',
            type: 'POST',
            params: [],
            body: ['name', 'description', 'organization']
        },
        update: {
            path: '/project/update',
            type: 'PUT',
            params: ['id'],
            body: ['name', 'description']
        },
        delete: {
            path: '/project/delete',
            type: 'DELETE',
            params: ['id'],
            body: []
        }
    },
    ticket: {
        create: {
            path: '/ticket/create',
            type: 'POST',
            params: [],
            body: [ 'title', 'description', 'status_id', 'resolution', 'type_id', 'assignee_user_id']
        },
        update: {
            path: '/ticket/update',
            type: 'PUT',
            params: ['id'],
            body: [ 'title', 'description', 'status_id' , 'resolution', 'type_id', 'assignee_user_id']
        },
        delete: {
            path: '/ticket/delete',
            type: 'POST',
            params: ['id'],
            body: []
        }
    },
    config: {
        type: {
            create: {
                path: '/project/type/create',
                type: 'POST',
                params: [],
                body: ['name', 'icon']
            },
            delete: {
                path: '/project/type/delete',
                type: 'POST',
                params: [],
                body: []
            }
        },
        status: {
            create: {
                path: '/project/status/create',
                type: 'POST',
                params: [],
                body: ['name', 'color' ]
            },
            delete: {
                path: '/project/status/delete',
                type: 'POST',
                params: ['id'],
                body: []
            }
        }
    }
}

module.exports = routes;