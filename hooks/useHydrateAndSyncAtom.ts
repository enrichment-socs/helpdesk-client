/*
  useHydrateAtoms only hydrate at initial render, hence if the page is not fully reloaded
  (for example: we update the router query string using router.push), atoms will not get updated.
  To force the atoms update, we need to use useSetAtom function in useEffect whenever a server side props changed.
  Therefore, I (LL20-2) created this hook to reduce the redundancy of applying such solution.
  Reference: https://github.com/pmndrs/jotai/discussions/669
*/

/* eslint-disable react-hooks/exhaustive-deps */
import { Atom, SetAtom } from 'jotai/core/atom';
import { useHydrateAtoms } from 'jotai/utils';
import { useEffect } from 'react';

export default function useHydrateAndSyncAtom(
  params: Array<readonly [Atom<unknown>, SetAtom<unknown, void>, unknown]>
) {
  const setFunctions = params.map((p) => p[1]);
  const values = params.map((p) => p[2]);
  const hydrateAtoms = params.map((p, idx) => [p[0], values[idx]]).flat() as [
    Atom<unknown>,
    unknown
  ];

  useHydrateAtoms([hydrateAtoms] as const);

  useEffect(() => {
    setFunctions.forEach((setFunc, idx) => setFunc(values[idx]));
  }, values);
}
