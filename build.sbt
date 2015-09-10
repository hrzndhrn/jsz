name := """jsz"""

version := "0.0.1"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.6"

libraryDependencies ++= Seq(
  jdbc,
  cache,
  ws,
  specs2 % Test
)

resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"

// Play provides two styles of routers, one expects its actions to be injected, the
// other, legacy style, accesses its actions statically.
routesGenerator := InjectedRoutesGenerator

includeFilter in (Assets, StylusKeys.stylus) := "*.styl"

javaOptions := Seq("-Duser.timezone=GMT")

// pipelineStages in Assets := Seq(example)

// fork in run := true

