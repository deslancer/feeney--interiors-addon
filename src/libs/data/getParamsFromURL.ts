type AllowedParams = {
  userId: string;
  sceneId: string;
  token: string;
  projectId: string;
};

export const getParamsFromURL = (): AllowedParams | null => {
  if (!document.location.search) {
    console.error(
      '%cNo get params provided',
      'color: red; font-family:monospace; font-size: 12px'
    );
  }

  const urlParams = Object.fromEntries(
    new URLSearchParams(document.location.search)
  ) as AllowedParams;

  if (urlParams) {
    return {
      userId: urlParams.userId,
      sceneId: urlParams.sceneId,
      token: urlParams.token,
      projectId: urlParams.projectId,
    };
  } else {
    return null;
  }
};
