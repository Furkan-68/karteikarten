import { useState, useEffect } from 'react'
import { Button } from "/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "/components/ui/card"
import { Input } from "/components/ui/input"
import { Label } from "/components/ui/label"
import { Textarea } from "/components/ui/textarea"
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from "recharts"
import { Plus, Edit, Trash, ArrowRight, Home, Settings } from "lucide-react"

interface Flashcard {
  id: number
  front: string
  back: string
  history: ('pass' | 'fail')[]
}

interface StudentState {
  flashcards: Flashcard[]
  currentFlashcardIndex: number
}

export default function FlashcardApp() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0)
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [isStatisticsView, setIsStatisticsView] = useState(false)
  const [newFlashcardFront, setNewFlashcardFront] = useState('')
  const [newFlashcardBack, setNewFlashcardBack] = useState('')
  const [editingFlashcardId, setEditingFlashcardId] = useState<number | null>(null)
  const [editingFlashcardFront, setEditingFlashcardFront] = useState('')
  const [editingFlashcardBack, setEditingFlashcardBack] = useState('')
  const [classId, setClassId] = useState('')
  const [showClassIdInput, setShowClassIdInput] = useState(true)

  const currentFlashcard = flashcards[currentFlashcardIndex]

  useEffect(() => {
    const storedClassId = localStorage.getItem('classId')
    if (storedClassId) {
      setClassId(storedClassId)
      setShowClassIdInput(false)
      loadFlashcards(storedClassId)
    }
  }, [])

  useEffect(() => {
    if (classId) {
      localStorage.setItem('classId', classId)
      loadFlashcards(classId)
    }
  }, [classId])

  useEffect(() => {
    const studentState: StudentState = { flashcards, currentFlashcardIndex }
    localStorage.setItem(`studentState_${classId}`, JSON.stringify(studentState))
  }, [flashcards, currentFlashcardIndex, classId])

  const loadFlashcards = (classId: string) => {
    const studentState = localStorage.getItem(`studentState_${classId}`)
    if (studentState) {
      const { flashcards, currentFlashcardIndex } = JSON.parse(studentState) as StudentState
      setFlashcards(flashcards)
      setCurrentFlashcardIndex(currentFlashcardIndex)
    } else {
      setFlashcards([
        { id: 1, front: "Was ist die Hauptstadt von Frankreich?", back: "Paris", history: [] },
        { id: 2, front: "Was ist 2 + 2?", back: "4", history: [] },
        { id: 3, front: "Was ist die Hauptstadt von Deutschland?", back: "Berlin", history: [] },
        { id: 4, front: "Was ist die Hauptstadt von Italien?", back: "Rom", history: [] },
        { id: 5, front: "Was ist die Hauptstadt von Spanien?", back: "Madrid", history: [] },
        { id: 6, front: "Was ist die Hauptstadt von Portugal?", back: "Lissabon", history: [] },
        { id: 7, front: "Was ist die Hauptstadt von Griechenland?", back: "Athen", history: [] },
        { id: 8, front: "Was ist die Hauptstadt von Polen?", back: "Warschau", history: [] },
        { id: 9, front: "Was ist die Hauptstadt von Ungarn?", back: "Budapest", history: [] },
        { id: 10, front: "Was ist die Hauptstadt von Tschechien?", back: "Prag", history: [] },
        { id: 11, front: "Was ist die Hauptstadt von Slowakei?", back: "Bratislava", history: [] },
        { id: 12, front: "Was ist die Hauptstadt von Rumänien?", back: "Bukarest", history: [] },
        { id: 13, front: "Was ist die Hauptstadt von Bulgarien?", back: "Sofia", history: [] },
        { id: 14, front: "Was ist die Hauptstadt von Kroatien?", back: "Zagreb", history: [] },
        { id: 15, front: "Was ist die Hauptstadt von Serbien?", back: "Belgrad", history: [] },
        { id: 16, front: "Was ist die Hauptstadt von Bosnien und Herzegowina?", back: "Sarajevo", history: [] },
        { id: 17, front: "Was ist die Hauptstadt von Montenegro?", back: "Podgorica", history: [] },
        { id: 18, front: "Was ist die Hauptstadt von Albanien?", back: "Tirana", history: [] },
        { id: 19, front: "Was ist die Hauptstadt von Rumänien?", back: "Bukarest", history: [] },
        { id: 20, front: "Was ist die Hauptstadt von Bulgarien?", back: "Sofia", history: [] },
      ])
      setCurrentFlashcardIndex(0)
    }
  }

  const revealAnswer = () => setIsAnswerRevealed(true)

  const markFlashcard = (result: 'pass' | 'fail') => {
    const updatedFlashcards = flashcards.map((flashcard) =>
      flashcard.id === currentFlashcard.id
        ? { ...flashcard, history: [...flashcard.history, result] }
        : flashcard
    )
    setFlashcards(updatedFlashcards)
    setIsAnswerRevealed(false)
    setCurrentFlashcardIndex((prevIndex) => (prevIndex + 1) % flashcards.length)
  }

  const addFlashcard = () => {
    const newFlashcard: Flashcard = {
      id: flashcards.length + 1,
      front: newFlashcardFront,
      back: newFlashcardBack,
      history: [],
    }
    setFlashcards([...flashcards, newFlashcard])
    setIsAdding(false)
    setNewFlashcardFront('')
    setNewFlashcardBack('')
  }

  const editFlashcard = () => {
    const updatedFlashcards = flashcards.map((flashcard) =>
      flashcard.id === editingFlashcardId
        ? { ...flashcard, front: editingFlashcardFront, back: editingFlashcardBack }
        : flashcard
    )
    setFlashcards(updatedFlashcards)
    setIsEditing(false)
    setEditingFlashcardId(null)
    setEditingFlashcardFront('')
    setEditingFlashcardBack('')
  }

  const deleteFlashcard = (id: number) => {
    const updatedFlashcards = flashcards.filter((flashcard) => flashcard.id !== id)
    setFlashcards(updatedFlashcards)
    setCurrentFlashcardIndex(0)
  }

  const startEditingFlashcard = (id: number) => {
    const flashcardToEdit = flashcards.find((flashcard) => flashcard.id === id)
    if (flashcardToEdit) {
      setEditingFlashcardId(id)
      setEditingFlashcardFront(flashcardToEdit.front)
      setEditingFlashcardBack(flashcardToEdit.back)
      setIsEditing(true)
    }
  }

  const calculateStatistics = () => {
    const passCount = flashcards.reduce((acc, flashcard) => acc + flashcard.history.filter((result) => result === 'pass').length, 0)
    const failCount = flashcards.reduce((acc, flashcard) => acc + flashcard.history.filter((result) => result === 'fail').length, 0)
    return { passCount, failCount }
  }

  const { passCount, failCount } = calculateStatistics()

  const data = [
    { name: 'Pass', value: passCount },
    { name: 'Fail', value: failCount },
  ]

  const cardsLeft = flashcards.length - currentFlashcardIndex

  const handleClassIdSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (classId) {
      localStorage.setItem('classId', classId)
      setShowClassIdInput(false)
      loadFlashcards(classId)
    }
  }

  if (showClassIdInput) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <header className="bg-primary text-primary-foreground shadow-lg">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Flashcard App</h1>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Klassen-ID eingeben</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleClassIdSubmit}>
                <div className="mb-4">
                  <Label htmlFor="classId">Klassen-ID</Label>
                  <Input id="classId" value={classId} onChange={(e) => setClassId(e.target.value)} className="mt-2" required />
                </div>
                <Button type="submit">Bestätigen</Button>
              </form>
            </CardContent>
          </Card>
        </main>
        <footer className="bg-muted mt-8">
          <div className="container mx-auto px-4 py-6 text-center">
            <p>&copy; 2023 Flashcard App. Alle Rechte vorbehalten.</p>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Flashcard App</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Button variant="outline" onClick={() => setIsAdminMode(!isAdminMode)}>
                  {isAdminMode ? <Home className="mr-2 h-4 w-4" /> : <Settings className="mr-2 h-4 w-4" />}
                  {isAdminMode ? 'Schülermodus' : 'Adminmodus'}
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {isAdminMode ? (
          <div>
            <h2 className="text-3xl font-bold mb-6">Admin Panel</h2>
            {isAdding ? (
              <div className="mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Flashcard hinzufügen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Label htmlFor="front">Vorderseite</Label>
                      <Input id="front" value={newFlashcardFront} onChange={(e) => setNewFlashcardFront(e.target.value)} className="mt-2" />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="back">Rückseite</Label>
                      <Textarea id="back" value={newFlashcardBack} onChange={(e) => setNewFlashcardBack(e.target.value)} className="mt-2" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={addFlashcard}>Hinzufügen</Button>
                    <Button variant="outline" onClick={() => setIsAdding(false)} className="ml-2">Abbrechen</Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <Button onClick={() => setIsAdding(true)} className="mb-6">
                <Plus className="mr-2 h-4 w-4" /> Flashcard hinzufügen
              </Button>
            )}
            {isEditing ? (
              <div className="mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Flashcard bearbeiten</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Label htmlFor="front">Vorderseite</Label>
                      <Input id="front" value={editingFlashcardFront} onChange={(e) => setEditingFlashcardFront(e.target.value)} className="mt-2" />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="back">Rückseite</Label>
                      <Textarea id="back" value={editingFlashcardBack} onChange={(e) => setEditingFlashcardBack(e.target.value)} className="mt-2" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={editFlashcard}>Speichern</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="ml-2">Abbrechen</Button>
                  </CardFooter>
                </Card>
              </div>
            ) : null}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashcards.map((flashcard) => (
                <Card key={flashcard.id}>
                  <CardHeader>
                    <CardTitle>{flashcard.front}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{flashcard.back}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {flashcard.history.length} Versuche
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => startEditingFlashcard(flashcard.id)}>
                        <Edit className="mr-2 h-4 w-4" /> Bearbeiten
                      </Button>
                      <Button variant="destructive" onClick={() => deleteFlashcard(flashcard.id)}>
                        <Trash className="mr-2 h-4 w-4" /> Löschen
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {isStatisticsView ? (
              <div>
                <h2 className="text-3xl font-bold mb-6">Statistiken</h2>
                <LineChart width={600} height={300} data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
                <Button onClick={() => setIsStatisticsView(false)} className="mt-6">
                  <ArrowRight className="mr-2 h-4 w-4" /> Zurück zum Lernmodus
                </Button>
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold mb-6">Lernmodus</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>{currentFlashcard.front}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isAnswerRevealed ? (
                      <p className="text-muted-foreground">{currentFlashcard.back}</p>
                    ) : (
                      <Button onClick={revealAnswer}>Antwort anzeigen</Button>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    {isAnswerRevealed ? (
                      <div className="flex space-x-2">
                        <Button onClick={() => markFlashcard('pass')}>Bestanden</Button>
                        <Button variant="destructive" onClick={() => markFlashcard('fail')}>Gescheitert</Button>
                      </div>
                    ) : null}
                    <Button variant="outline" onClick={() => setIsStatisticsView(true)}>
                      <ArrowRight className="mr-2 h-4 w-4" /> Statistiken anzeigen
                    </Button>
                  </CardFooter>
                </Card>
                <div className="mt-6 text-center">
                  <p>{cardsLeft} Karten übrig</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-muted mt-8">
        <div className="container mx-auto px-4 py-6 text-center">
          <p>&copy; 2023 Flashcard App. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  )
}