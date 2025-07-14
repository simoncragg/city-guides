const modules = import.meta.glob(
  "../assets/avatars/*-sm-min.png",
  { eager: true }
);

export const avatarMap: Record<string, string> = Object.entries(modules)
  .map(([path, module]) => {
    const name = path
      .split("/")
      .pop()!
      .replace("-sm-min.png", "");
    // @ts-expect-error – module.default is the URL string
    return [name, module.default];
  })
  .reduce((acc, [name, url]) => ({ ...acc, [name]: url }), {});

export default avatarMap;
