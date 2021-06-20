import {
  RegisterLocker as RegisterLockerEvent,
  ConfirmLocker as ConfirmLockerEvent,
  Release as ReleaseEvent,
  Withdraw as WithdrawEvent,
  Lock as LockEvent,
  Resolve as ResolveEvent,
  Locker as LockerContract
} from '../generated/Locker/Locker';

import {
  Deposit,
  Lock,
  Locker,
  Release,
  Resolve,
  Withdraw
} from '../generated/schema';

export function handleRegisterLocker(event: RegisterLockerEvent): void {
  let locker = new Locker(event.params.index.toHexString());

  locker.lockerIndex = event.params.index;
  locker.clientAddress = event.params.client;
  locker.resolverAddress = event.params.resolver;
  locker.lockerToken = event.params.token;
  locker.lockerValue = event.params.cap;
  locker.milestones = event.params.batch;
  locker.timestamp = event.block.timestamp;
  locker.txHash = event.transaction.hash;

  locker.save();
}

export function handleConfirmLocker(event: ConfirmLockerEvent): void {
  let locker = Locker.load(event.params.index.toHexString());

  if (locker == null) {
    locker = new Locker(event.params.index.toHexString());
  }

  let deposit = new Deposit(event.params.index.toHexString());

  deposit.amount = event.params.sum;
  deposit.timestamp = event.block.timestamp;
  deposit.txHash = event.transaction.hash;
  deposit.locker = event.params.index.toHexString();

  locker.save();
  deposit.save();
}

export function handleRelease(event: ReleaseEvent): void {
  let locker = Locker.load(event.params.index.toHexString());

  if (locker == null) {
    locker = new Locker(event.params.index.toHexString());
  }

  let release = new Release(event.params.index.toHexString());

  let lockerContract = LockerContract.bind(event.address);

  release.amount = lockerContract.lockers(locker.lockerIndex).value6;
  release.timestamp = event.block.timestamp;
  release.txHash = event.transaction.hash;
  release.locker = event.params.index.toHexString();

  locker.save();
  release.save();
}

export function handleWithdraw(event: WithdrawEvent): void {
  let locker = Locker.load(event.params.index.toHexString());

  if (locker == null) {
    locker = new Locker(event.params.index.toHexString());
  }

  let withdraw = new Withdraw(event.params.index.toHexString());

  withdraw.amount = event.params.remainder;
  withdraw.timestamp = event.block.timestamp;
  withdraw.txHash = event.transaction.hash;
  withdraw.locker = event.params.index.toHexString();

  locker.save();
  withdraw.save();
}

export function handleLock(event: LockEvent): void {
  let locker = Locker.load(event.params.index.toHexString());

  if (locker == null) {
    locker = new Locker(event.params.index.toHexString());
  }

  let lock = new Lock(event.params.index.toHexString());

  let lockerContract = LockerContract.bind(event.address);

  lock.amount = lockerContract
    .lockers(event.params.index)
    .value5.minus(lockerContract.lockers(event.params.index).value6);
  lock.timestamp = event.block.timestamp;
  lock.txHash = event.transaction.hash;
  lock.locker = event.params.index.toHexString();

  locker.save();
  lock.save();
}

export function handleResolve(event: ResolveEvent): void {
  let locker = Locker.load(event.params.index.toHexString());

  if (locker == null) {
    locker = new Locker(event.params.index.toHexString());
  }

  let resolve = new Resolve(event.params.index.toHexString());

  resolve.resolverAddress = event.params.resolver;
  resolve.clientAward = event.params.clientAward;
  resolve.resolutionFee = event.params.resolutionFee;
  resolve.locker = event.params.index.toHexString();
  resolve.timestamp = event.block.timestamp;
  resolve.txHash = event.transaction.hash;

  locker.save();
  resolve.save();
}
