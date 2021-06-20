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
  locker.perMilestoneSplit = event.params.batch;

  let paymentSplit = event.params.batch;
  locker.providerPayment = paymentSplit[0];
  locker.spoilsPayment = paymentSplit[1];

  locker.timestamp = event.block.timestamp;
  locker.txHash = event.transaction.hash;

  locker.save();
}

export function handleConfirmLocker(event: ConfirmLockerEvent): void {
  let deposit = new Deposit(event.params.index.toHexString());

  deposit.amount = event.params.sum;
  deposit.timestamp = event.block.timestamp;
  deposit.txHash = event.transaction.hash;
  deposit.locker = event.params.index.toHexString();

  deposit.save();
}

export function handleRelease(event: ReleaseEvent): void {
  let release = new Release(event.params.index.toHexString());
  let locker = Locker.load(event.params.index.toHexString());

  // let lockerContract = LockerContract.bind(event.address);

  // let totalDeposited = locker.lockerValue
  let paymentPerMilestone = locker.providerPayment.plus(locker.spoilsPayment);
  // let totalReleased = lockerContract.lockers(event.params.index).value6;

  release.amount = paymentPerMilestone;
  release.timestamp = event.block.timestamp;
  release.txHash = event.transaction.hash;
  release.locker = event.params.index.toHexString();

  release.save();
}

export function handleWithdraw(event: WithdrawEvent): void {
  let withdraw = new Withdraw(event.params.index.toHexString());

  withdraw.amount = event.params.remainder;
  withdraw.timestamp = event.block.timestamp;
  withdraw.txHash = event.transaction.hash;
  withdraw.locker = event.params.index.toHexString();

  withdraw.save();
}

export function handleLock(event: LockEvent): void {
  let lock = new Lock(event.params.index.toHexString());

  let lockerContract = LockerContract.bind(event.address);

  lock.amount = lockerContract
    .lockers(event.params.index)
    .value5.minus(lockerContract.lockers(event.params.index).value6);
  lock.timestamp = event.block.timestamp;
  lock.txHash = event.transaction.hash;
  lock.locker = event.params.index.toHexString();

  lock.save();
}

export function handleResolve(event: ResolveEvent): void {
  let resolve = new Resolve(event.params.index.toHexString());

  resolve.resolverAddress = event.params.resolver;
  resolve.clientAward = event.params.clientAward;
  resolve.resolutionFee = event.params.resolutionFee;
  resolve.locker = event.params.index.toHexString();
  resolve.timestamp = event.block.timestamp;
  resolve.txHash = event.transaction.hash;

  resolve.save();
}
