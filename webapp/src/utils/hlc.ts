import { nanoid } from "nanoid";

/*    understand/
 * The current Hybric Logical Clock
 */
type HLC = {
  ts: number;
  nn: number;
  id: string;
};

let hlc: HLC;

/*    outcome/
 * Initialize the clock to start
 */
function init() {
  hlc = {
    ts: Date.now(),
    nn: 0,
    id: nanoid(),
  };
}

/*    outcome/
 * This is the 'increment' function of a hybrid logical clock - we
 * adjust the current clock either with the latest timestamp or with an
 * incremented counter and return a serialized value
 */
function next(): string {
  try {
    hlc = inc(hlc);
    return serial(hlc);
  } catch (e) {
    console.error(e);
  }
}

function inc(my: HLC) {
  let now = Date.now();
  if (now > my.ts) {
    return { id: my.id, ts: now, nn: 0 };
  } else {
    return { id: my.id, ts: my.ts, nn: my.nn + 1 };
  }
}

function serial(hlc: HLC): string {
  return `${hlc.ts}:${hlc.nn}:${hlc.id}`;
}

function parse(hlc: string): HLC {
  let p = hlc.split(":");
  return {
    ts: parseInt(p[0]),
    nn: parseInt(p[1]),
    id: p[2],
  } as HLC;
}

/*    outcome/
 * This is the 'receive' function of a hybrid logical clock - we parse
 * the remote hlc and adjust the current clock with the latest timestamp
 * or the newly received clock whichever wins
 */
function recv(remoteHLCString: string): string {
  try {
    const remote = parse(remoteHLCString);
    hlc = receive(remote, hlc);
    return serial(hlc);
  } catch (e) {
    console.error(e);
  }
}

function receive(remote: HLC, my: HLC): HLC {
  let now = Date.now();
  if (now > my.ts && now > remote.ts) {
    return { id: my.id, ts: now, nn: 0 };
  }
  if (my.ts == remote.ts) {
    let nn = Math.max(my.nn, remote.nn) + 1;
    return { id: my.id, ts: my.ts, nn };
  }

  if (remote.ts > hlc.ts) {
    return { id: my.id, ts: remote.ts, nn: remote.nn + 1 };
  }

  return { id: my.id, ts: my.ts, nn: my.nn + 1 };
}

init();

export const hClock = {
  next,
  recv,
};
