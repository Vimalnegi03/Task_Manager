export const UserRoleEnums={
    ADMIN:'admin',
    PROJECT_ADMIN:'project_admin',
    MEMBER:"member"
}

export const UserAvailableRoles=Object.values(UserRoleEnums)

export const TaskStatusEnum={
    TODO:"todo",
    IN_PROGRESS:"in_progress",
    DONE:"done"
}

export const AvailableTaskStatuses=Object.values(TaskStatusEnum)