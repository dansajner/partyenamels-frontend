import { useEffect, useState } from 'react'
import type { NextPage } from "next";
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import styled from 'styled-components'

import {
    Generator as MazeGenerator,
    GeneratorData,
    BinaryTree,
    BinaryTreeData,
    Sidewinder,
    SidewinderData,
    Image,
    AldousBroder,
    AldousBroderData,
    Wilson,
    WilsonData,
    HuntAndKill,
    HuntAndKillData,
    RecursiveBacktracker,
    RecursiveBacktrackerData,
    Prim,
    PrimData,
    Kruskal,
    KruskalData,
    GrowingTree,
    GrowingTreeData,
    Eller,
    EllerData,
    RecursiveSubdivision,
    RecursiveSubdivisionData,
    DisplayData,
    Random,
  } from '../../lib/mazes';

  import { Canvas } from "../../lib/components/canvas";

const getGenerator = (generatorId: number) : MazeGenerator => {
    let maze: MazeGenerator
    const generatorData: GeneratorData = new GeneratorData()
    generatorData.generator = generatorId
    generatorData.height = 10
    generatorData.width = 10
    generatorData.numCellSides = 4
    generatorData.maskImage = undefined
    generatorData.weave = 0
    generatorData.cullDeadEnds = 0
    generatorData.seed = 1

    switch (generatorId) {
        case 1:
          maze = new BinaryTree(generatorData, new BinaryTreeData())
          break
        case 2:
          maze = new Sidewinder(generatorData, new SidewinderData())
          break
        case 3:
          maze = new AldousBroder(generatorData, new AldousBroderData())
          break
        case 4:
          maze = new Wilson(generatorData, new WilsonData())
          break
        case 5:
          maze = new HuntAndKill(generatorData, new HuntAndKillData())
          break
        case 6:
          maze = new RecursiveBacktracker(generatorData, new RecursiveBacktrackerData())
          break
        case 7:
          maze = new Kruskal(generatorData, new KruskalData())
          break
        case 8:
          maze = new Prim(generatorData, new PrimData())
          break
        case 9:
          maze = new GrowingTree(generatorData, new GrowingTreeData())
          break
        case 10:
          maze = new Eller(generatorData, new EllerData())
          break
        case 11:
          maze = new RecursiveSubdivision(generatorData, new RecursiveSubdivisionData())
          break
        default:
          maze = new BinaryTree(generatorData, new BinaryTreeData())
          break
      }

    return maze
}

const getGeneratorPropertiesTabName = (gId: number) : string => {
    let retVal: string = '';
    switch (gId) {
      case 1:
        retVal = 'Binary Tree';
        break;
      case 2:
        retVal = 'Sidewinder';
        break;
      case 3:
        retVal = 'Aldous-Broder';
        break;
      case 4:
        retVal = "Wilson's";
        break;
      case 5:
        retVal = 'Hunt and Kill';
        break;
      case 6:
        retVal = 'Recursive Backtracker';
        break;
      case 7:
        retVal = "Kruskal's";
        break;
      case 8:
        retVal = "Prims's";
        break;
      case 9:
        retVal = 'Growing Tree';
        break;
      case 10:
        retVal = "Eller's";
        break;
      case 11:
        retVal = 'Recursive Subdivision';
        break;
    }
    return retVal;
  }

const random: Random = new Random(1)

const StyledMazeSection = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  align-items: center;
`

const Mazes: NextPage = () => {
    const [generatorId, setGeneratorId] = useState(1)
    const [image, setImage] = useState(new Image(1, 1))

    useEffect(() => {
      const generator: MazeGenerator = getGenerator(generatorId)
      generator.RunGenerator()
      setImage(generator.Display(new DisplayData()))
    }, [generatorId])


    return (
        <div className={styles.container}>
            <Head>
                <title>Party Enamels - Engineering</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Random Maze Generation
                </h1>
                <StyledMazeSection>
                    <p>{getGeneratorPropertiesTabName(generatorId)}</p>
                    {/* @ts-ignore */}
                    <Canvas id="mazeCanvas" imgData={image}></Canvas>
                    <button onClick={() => setGeneratorId(random.GetIntInRange(1, 11))}>Generate</button>
                </StyledMazeSection>
            </main>
        </div>
    )
}

export default Mazes