"use client"

import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {Task, TaskStatus, User} from "@/types";
import {useStore} from "@/store";
import {useAuth} from "react-oidc-context";
import {updateTask} from "@/actions/tasks";
import {useState} from "react";

export function UpdateTaskForm({task, users}: { task: Task, users: User[] }) {
    const store = useStore();
    const auth = useAuth();

    const [taskUpdates, setTaskUpdates] = useState<Partial<Task>>(task);
    const statuses = ["open", "closed", "completed"];

    return (
        <form
            action={async (formData) => {
                await updateTask(task.id, formData, auth.user?.id_token!);
            }}
            className="space-y-4"
        >
            <div className="space-y-2">
                <Label htmlFor="name">Task Name</Label>
                <Input id="name" name="name" value={taskUpdates.name} defaultValue={task.name}
                       onChange={(e) => setTaskUpdates({...taskUpdates, name: e.target.value})}
                       required/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    aria-describedby="description"
                    name="description"
                    defaultValue={task.description}
                    onChange={(e) => setTaskUpdates({...taskUpdates, description: e.target.value})}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                    id="deadline"
                    name="deadline"
                    type="datetime-local"
                    defaultValue={new Date(task.deadline).toISOString().slice(0, -1)}
                    onChange={(value) => setTaskUpdates({
                        ...taskUpdates,
                        deadline: new Date(value.target.value).getTime()
                    })}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="responsibility">Assign To</Label>
                <Select name="responsibility" defaultValue={task.responsibility}
                        onValueChange={(value) => setTaskUpdates({...taskUpdates, responsibility: value})} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select user"/>
                    </SelectTrigger>
                    <SelectContent>
                        {users.map((user, idx) => (
                            <SelectItem key={idx} value={user.email}>
                                {user.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" value={taskUpdates.status} defaultValue={task.status}
                        onValueChange={(value) => setTaskUpdates({...taskUpdates, status: value as TaskStatus})}
                        required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status"/>
                    </SelectTrigger>
                    <SelectContent>
                        {statuses.map((status, idx) => (
                            <SelectItem key={idx} value={status}>
                                {status}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {store.currentUserInAdminGroup && (
                <Button type="submit" className="w-full">
                    Update Task
                </Button>
            )}
        </form>
    );
}
