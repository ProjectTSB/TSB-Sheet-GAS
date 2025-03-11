type ArtifactPredicate = (attr: Record<string, string>) => boolean
type Schema = [ArtifactPredicate, children?: Schema[]]
