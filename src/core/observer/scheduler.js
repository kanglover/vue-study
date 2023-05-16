function resetSchedulerState() {
    index = queue.length = activatedChildren.length = 0
    has = {}
    waiting = flushing = false
}

function callActivatedHooks(queue) {
    for (let i = 0; i < queue.length; i++) {
        queue[i]._inactive = true;
        activateChildComponent(queue[i], true /* true */ );
    }
}

function callUpdatedHooks(queue) {
    let i = queue.length;
    while (i--) {
        const watcher = queue[i];
        const vm = watcher.vm;
        if (vm && vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
            callHook(vm, 'updated');
        }
    }
}

function flushSchedulerQueue() {
    currentFlushTimestamp = getNow();
    flushing = true;
    let watcher, id;

    queue.sort(sortCompareFn);

    for (index = 0; index < queue.length; index++) {
        watcher = queue[index];
        if (watcher.before) {
            watcher.before();
        }
        id = watcher.id;
        has[id] = null;
        watcher.run();
    }

    const activatedQueue = activatedChildren.slice();
    const updatedQueue = queue.slice();

    resetSchedulerState();

    callActivatedHooks(activatedQueue);
    callUpdatedHooks(updatedQueue);
    cleanupDeps();
}

export function queueWatcher(watcher) {
    const id = watcher.id;
    if (has[id] != null) {
        return;
    }

    if (watcher === Dep.target && watcher.noRecurse) {
        return;
    }

    has[id] = true;
    if (!flushing) {
        queue.push(watcher);
    } else {
        let i = queue.length - 1;
        while (i > index && queue[i].id > watcher.id) {
            i--;
        }
        queue.splice(i + 1, 0, watcher);
    }
    if (!waiting) {
        waiting = true;
        nextTick(flushSchedulerQueue);
    }
}