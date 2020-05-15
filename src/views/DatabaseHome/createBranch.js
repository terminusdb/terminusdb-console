function handleBranch(){
    let nuid = newBranch.value
    props.onBranch(nuid)
}
<button className = { CommitViewerText.branchButton.className }
    onClick={handleBranch}>
    { CommitViewerText.branchButton.text }
</button>
<input placeholder={ CommitViewerText.branchInput.text }
    className = { CommitViewerText.branchInput.className }
    ref={bid  => (setNewBranch(bid))}
    name = "branch-input"/>

